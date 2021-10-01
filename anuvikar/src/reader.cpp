#include <algorithm>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <tuple>
#include <unordered_map>

#include <helper.hpp>
#include <infoReader.hpp>
#include <logger.hpp>
#include <printJson.hpp>
#include <reader.hpp>
#include <results.hpp>
#include <xyz2defects.hpp>

auto filterZeroClusters(anuvikar::DefectVecT &defects,
                        anuvikar::ClusterSizeMapT &clusterSize, bool isFilter) {
  using namespace anuvikar::DefectTWrap;
  if (anuvikar::Logger::inst().mode() & anuvikar::LogMode::debug) {
    for (auto it : clusterSize) {
      if (it.second.surviving == 0) {
        anuvikar::Logger::inst().log_debug(
            "Found cluster with zero size. (id, total defects): " +
            std::to_string(it.first) + ", " + std::to_string(it.second.all));
      }
    }
  }
  if (!isFilter) return;
  auto initSize = defects.size();
  defects.erase(
      std::remove_if(defects.begin(), defects.end(),
                     [&clusterSize](const auto &defect) {
                       return clusterSize[clusterId(defect)].surviving == 0;
                     }),
      defects.end());
}

std::pair<anuvikar::ErrorStatus,int> anuvikar::processFileTimeCmd(std::string xyzfileName,
                                            std::ostream &outfile,
                                            const anuvikar::Config &config, int id, const anuvikar::InputInfo &defaultInfo, const anuvikar::ExtraInfo &defaultExtraInfo, bool isDefaultInfo) {
  std::string infileName, tag;
  std::tie(infileName, tag) = anuvikar::getInfileFromXyzfile(xyzfileName);
  //if (infileName.empty()) return std::make_pair(anuvikar::ErrorStatus::inputFileMissing, 0);
  anuvikar::XyzFileType sc {anuvikar::XyzFileType::generic};
  anuvikar::InputInfo info;
  anuvikar::ExtraInfo extraInfo;
  bool isInfo;
  if (infileName.empty()) {
    if (!isDefaultInfo) return std::make_pair(anuvikar::ErrorStatus::inputFileMissing, 0);
    info = defaultInfo;
    extraInfo = defaultExtraInfo;
    isInfo = isDefaultInfo;
    sc = info.xyzFileType;
  } else {
    bool status;
    std::tie(sc, status) = anuvikar::getSimulationCode(infileName);
    if (!status) return std::make_pair(anuvikar::ErrorStatus::unknownSimulator, 0);
    std::tie(info, extraInfo, isInfo) =
      (sc == anuvikar::XyzFileType::parcasWithStdHeader)
          ? anuvikar::extractInfoParcas(infileName, tag)
          : anuvikar::extractInfoLammps(infileName, tag);
    if (isDefaultInfo) Logger::inst().log_info("Found input file " + infileName);
  }
  if (!isInfo) return std::make_pair(anuvikar::ErrorStatus::InputFileincomplete, 0);
  info.xyzFileType = sc;
  info.xyzFilePath = xyzfileName;
  anuvikar::frameStatus fs = anuvikar::frameStatus::prelude;
  std::ifstream xyzfile{info.xyzFilePath};
  if (xyzfile.bad() || !xyzfile.is_open()) return std::make_pair(anuvikar::ErrorStatus::xyzFileReadError, 0);
  auto success = 0;
  auto frameCount = 0;
  while (true) {
    extraInfo.simulationTime = success + 1;
    extraInfo.id = std::to_string(id + success + 1);
    auto res = anuvikar::processTimeFile(info, extraInfo, config, xyzfile, fs, outfile, success == 0);
    frameCount++;
    if (res.second != anuvikar::ErrorStatus::noError) {
      if (config.allFrames) std::cerr << "\nError: " << errToStr(res.second) << " in frame " << frameCount << " of file " << xyzfileName << '\n' << std::flush;
      else std::cerr << "\nError: " << errToStr(res.second) << " of file " << xyzfileName << '\n' << std::flush;
      Logger::inst().log_info("Error processing" + std::to_string(frameCount) +" frame in file \"" + xyzfileName + "\"");
    } else {
      ++success;
      if (config.allFrames) {
        if (success >= 2) std::cout << "\r" << success << " steps processed successfully." << std::flush;
        Logger::inst().log_info("Finished processing" + std::to_string(success) +" frame in file \"" + xyzfileName + "\"");
      }
    }
    if (res.first == anuvikar::xyzFileStatus::eof) break;
  }
  xyzfile.close();
  if (success > 0) return std::make_pair(anuvikar::ErrorStatus::noError, success);
  return std::make_pair(anuvikar::ErrorStatus::unknownError, 0);
}

std::pair<anuvikar::xyzFileStatus, anuvikar::ErrorStatus> 
                          anuvikar::processTimeFile(anuvikar::InputInfo &info,
                                     anuvikar::ExtraInfo &extraInfo,
                                     const anuvikar::Config &config, std::istream &infile, anuvikar::frameStatus &fs, std::ostream &outfile, bool isFirst) {
  auto res = anuvikar::resultsT{};
  //res.err = anuvikar::ErrorStatus::noError;
  anuvikar::xyzFileStatus fl;
  std::tie(fl, res.err, res.defects, res.coDefects) = 
      (info.xyzFileType == anuvikar::XyzFileType::lammpsDisplacedCompute)
          ? anuvikar::displaced2defectsTime(info, extraInfo, config, infile, fs)
          : anuvikar::xyz2defectsTime(info, extraInfo, config, infile, fs);
  if (res.err != anuvikar::ErrorStatus::noError) return std::make_pair(fl, res.err);
  res.defects = anuvikar::groupDefects(std::move(res.defects), info.latticeConst);
  auto clusterSizeMap = anuvikar::clusterSizes(res.defects);
  filterZeroClusters(res.defects, clusterSizeMap,
                     config.filterZeroSizeClusters);
  anuvikar::ignoreSmallClusters(res.defects, clusterSizeMap);
  res.clusters = anuvikar::clusterMapping(res.defects);
  res.clustersIV = anuvikar::clusterIVType(res.clusters, clusterSizeMap);
  if (config.isFindClusterFeatures)
    res.feats = anuvikar::clusterFeatures(res.defects, res.clusters,
                                          clusterSizeMap, info.latticeConst);
  int nDefects;
  std::tie(res.nDefects, res.inClusterFractionI, res.inClusterFractionV) =
      anuvikar::getNDefectsAndClusterFractions(res.defects);
  std::tie(res.maxClusterSizeI, res.maxClusterSizeV) =
      anuvikar::getMaxClusterSizes(clusterSizeMap, res.clusters);
  res.nClusters = res.clusters.size();
  if (res.err == anuvikar::ErrorStatus::noError) {
    if (!isFirst) outfile << "\n,";
    anuvikar::printJson(outfile, info, extraInfo, res);
  }
  return std::make_pair(fl, res.err);
}