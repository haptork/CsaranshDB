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

auto filterZeroClusters(av::DefectVecT &defects,
                        av::ClusterSizeMapT &clusterSize, bool isFilter) {
  using namespace av::DefectTWrap;
  if (av::Logger::inst().mode() & av::LogMode::debug) {
    for (auto it : clusterSize) {
      if (it.second.surviving == 0) {
        av::Logger::inst().log_debug(
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

std::pair<av::ErrorStatus,int> av::processFileTimeCmd(std::string xyzfileName,
                                            std::ostream &outfile,
                                            const av::Config &config, int id, const av::InputInfo &defaultInfo, const av::ExtraInfo &defaultExtraInfo, bool isDefaultInfo) {
  std::string infileName, tag;
  std::tie(infileName, tag) = av::getInfileFromXyzfile(xyzfileName);
  //if (infileName.empty()) return std::make_pair(av::ErrorStatus::inputFileMissing, 0);
  av::XyzFileType sc {av::XyzFileType::generic};
  av::InputInfo info;
  av::ExtraInfo extraInfo;
  bool isInfo;
  if (infileName.empty()) {
    if (!isDefaultInfo) return std::make_pair(av::ErrorStatus::inputFileMissing, 0);
    info = defaultInfo;
    extraInfo = defaultExtraInfo;
    isInfo = isDefaultInfo;
    sc = info.xyzFileType;
  } else {
    bool status;
    std::tie(sc, status) = av::getSimulationCode(infileName);
    if (!status) return std::make_pair(av::ErrorStatus::unknownSimulator, 0);
    std::tie(info, extraInfo, isInfo) =
      (sc == av::XyzFileType::parcasWithStdHeader)
          ? av::extractInfoParcas(infileName, tag)
          : av::extractInfoLammps(infileName, tag);
    if (isDefaultInfo) Logger::inst().log_info("Found input file " + infileName);
  }
  if (!isInfo) return std::make_pair(av::ErrorStatus::InputFileincomplete, 0);
  info.xyzFileType = sc;
  info.xyzFilePath = xyzfileName;
  av::frameStatus fs = av::frameStatus::prelude;
  std::ifstream xyzfile{info.xyzFilePath};
  if (xyzfile.bad() || !xyzfile.is_open()) return std::make_pair(av::ErrorStatus::xyzFileReadError, 0);
  auto success = 0;
  auto frameCount = 0;
  while (true) {
    extraInfo.simulationTime = success + 1;
    extraInfo.id = std::to_string(id + success + 1);
    auto res = av::processTimeFile(info, extraInfo, config, xyzfile, fs, outfile, success == 0);
    frameCount++;
    if (res.second != av::ErrorStatus::noError) {
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
    if (res.first == av::xyzFileStatus::eof) break;
  }
  xyzfile.close();
  if (success > 0) return std::make_pair(av::ErrorStatus::noError, success);
  return std::make_pair(av::ErrorStatus::unknownError, 0);
}

std::pair<av::xyzFileStatus, av::ErrorStatus> 
                          av::processTimeFile(av::InputInfo &info,
                                     av::ExtraInfo &extraInfo,
                                     const av::Config &config, std::istream &infile, av::frameStatus &fs, std::ostream &outfile, bool isFirst) {
  auto res = av::resultsT{};
  //res.err = av::ErrorStatus::noError;
  av::xyzFileStatus fl;
  std::tie(fl, res.err, res.defects, res.coDefects) = 
      (info.xyzFileType == av::XyzFileType::lammpsDisplacedCompute)
          ? av::displaced2defectsTime(info, extraInfo, config, infile, fs)
          : av::xyz2defectsTime(info, extraInfo, config, infile, fs);
  if (res.err != av::ErrorStatus::noError) return std::make_pair(fl, res.err);
  res.defects = av::groupDefects(std::move(res.defects), info.latticeConst);
  auto clusterSizeMap = av::clusterSizes(res.defects);
  filterZeroClusters(res.defects, clusterSizeMap,
                     config.filterZeroSizeClusters);
  av::ignoreSmallClusters(res.defects, clusterSizeMap);
  res.clusters = av::clusterMapping(res.defects);
  res.clustersIV = av::clusterIVType(res.clusters, clusterSizeMap);
  if (config.isFindClusterFeatures)
    res.feats = av::clusterFeatures(res.defects, res.clusters,
                                          clusterSizeMap, info.latticeConst);
  int nDefects;
  std::tie(res.nDefects, res.inClusterFractionI, res.inClusterFractionV) =
      av::getNDefectsAndClusterFractions(res.defects);
  std::tie(res.maxClusterSizeI, res.maxClusterSizeV) =
      av::getMaxClusterSizes(clusterSizeMap, res.clusters);
  res.nClusters = res.clusters.size();
  if (res.err == av::ErrorStatus::noError) {
    if (!isFirst) outfile << "\n,";
    av::printJson(outfile, info, extraInfo, res);
  }
  return std::make_pair(fl, res.err);
}