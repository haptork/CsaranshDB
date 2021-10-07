#include <cluster2features.hpp>
#include <printJson.hpp>
#include <results.hpp>
#include <sstream>

void printClusterIds(const std::unordered_map<int, std::vector<int>> clusters,
                     std::ostream &outfile) {
  size_t i = 0;
  for (const auto &it : clusters) {
    outfile << '"' << it.first << "\":";
    outfile << "[";
    av::writeVector(it.second, outfile);
    outfile << "]";
    if (i != clusters.size() - 1) outfile << ", ";
    outfile << "\n";
    ++i;
  }
}

void printClusterIVs(const std::unordered_map<int, int> clusters,
                     std::ostream &outfile) {
  size_t i = 0;
  for (const auto &it : clusters) {
    outfile << '"' << it.first << "\":";
    outfile << it.second;
    if (i != clusters.size() - 1) outfile << ", ";
    outfile << "\n";
    ++i;
  }
}

void printSingleFeat(const av::featT &feats, std::ostream &outfile) {
  outfile << "\"dist\": ";
  outfile << "[";
  av::writeStdAr(std::get<0>(feats), outfile);
  outfile << "],\n";
  outfile << "\"angle\": ";
  outfile << "[";
  av::writeStdAr(std::get<1>(feats), outfile);
  /*
  outfile << "],\n";
  outfile << "\"adjNn2\": ";
  outfile << "[";
  av::writeStdAr(std::get<2>(feats), outfile);
  */
  outfile << "]\n";
}

void printFeats(const std::unordered_map<int, av::featT> &feats,
                std::ostream &outfile) {
  size_t count = 0;
  for (const auto &it : feats) {
    outfile << '"' << it.first << "\":";
    outfile << "{";
    printSingleFeat(it.second, outfile);
    outfile << "}";
    if (count++ != feats.size() - 1) outfile << ", ";
    outfile << "\n";
  }
}

auto strSimulationCode(av::XyzFileType code) {
  return (code == av::XyzFileType::cascadesDbLikeCols)
             ? "cascadesDbLikeCols"
             : (code == av::XyzFileType::lammpsWithStdHeader)
                   ? "lammpsWithStdHeader"
                   : (code == av::XyzFileType::parcasWithStdHeader)
                      ? "parcasWithStdHeader"
                      : (code == av::XyzFileType::lammpsDisplacedCompute)
                        ? "lammpsDisp"
                        : "generic-XYZ";
}

std::string errorStr(av::ErrorStatus err) {
  if (err == av::ErrorStatus::inputFileMissing) {
    return "Could not read input file";
  } else if (err == av::ErrorStatus::inputFileMissing) {
    return "Could not read input file";
  } else if (err == av::ErrorStatus::InputFileincomplete) {
    return "Input file doesn't have all the info";
  } else if (err == av::ErrorStatus::unknownSimulator) {
    return "Input file doesn't have LAMMPS/PARCAS/DISPLACED simulation input "
           "type";
  } else if (err == av::ErrorStatus::xyzFileDefectsProcessingError) {
    return "XYZ file has too many defects or zero atoms";
  }
  return "";
}

void av::resToKeyValue(std::ostream &outfile,
                             const av::resultsT &res) {
  auto printDefects = [&outfile](const av::DefectVecT &d) {
    size_t count = 0;
    for (const auto &x : d) {
      outfile << "[" << std::get<0>(x)[0] << ", " << std::get<0>(x)[1] << ", "
              << std::get<0>(x)[2] << ", " << std::get<1>(x) << ", "
              << std::get<2>(x) << ", " << std::get<3>(x) << "]";
      if (count++ < (d.size() - 1)) outfile << ", ";
    }
  };
  outfile << "\"error\":\"" << errorStr(res.err) << "\",\n"
          << "\"n_defects\":" << res.nDefects << ",\n"
          << "\"n_clusters\":" << res.nClusters << ",\n"
          << "\"max_cluster_size_I\":" << res.maxClusterSizeI << ",\n"
          << "\"max_cluster_size_V\":" << res.maxClusterSizeV << ",\n"
          << "\"max_cluster_size\":"
          << std::max(res.maxClusterSizeI, res.maxClusterSizeV) << ",\n"
          << "\"in_cluster_I\":" << res.inClusterFractionI << ",\n"
          << "\"in_cluster_V\":" << res.inClusterFractionV << ",\n"
          << "\"in_cluster\":"
          << (res.inClusterFractionI + res.inClusterFractionV) / 2.0 << ",\n";
  outfile << "\"coords\": [";
  printDefects(res.defects);
  outfile << "],\n";
  outfile << "\"clusters\": ";
  outfile << "{";
  printClusterIds(res.clusters, outfile);
  outfile << "}";
  outfile << ",\n";
  outfile << "\"clusterSizes\": ";
  outfile << "{";
  printClusterIVs(res.clustersIV, outfile);
  outfile << "}";
  outfile << ",\n";
  outfile << "\"features\": ";
  outfile << "{";
  printFeats(res.feats, outfile);
  outfile << "}";
  outfile << ",\n";
  outfile << "\"coDefects\": [";
  av::writeVector(res.coDefects, outfile);
  outfile << "]\n";
}

void av::infoToKeyValue(std::ostream &outfile,
                              const av::InputInfo &i,
                              const av::ExtraInfo &ei) {
  outfile << "\"xyzFilePath\": \"" << i.xyzFilePath << "\",\n"
          << "\"id\": \"" << ei.id << "\",\n"
          << "\"substrate\": \"" << ei.substrate << "\",\n"
          << "\"simulationCode\": \"" << strSimulationCode(i.xyzFileType)
          << "\",\n"
          << "\"energy\":" << ei.energy << ",\n"
          << "\"structure\": \"" << i.structure << "\",\n"
          << "\"simulationTime\":" << ei.simulationTime << ",\n"
          << "\"ncell\":" << i.ncell << ",\n"
          << "\"boxSize\":" << i.boxSize << ",\n"
          << "\"origin\": [" << i.originX << ", " << i.originY << ", "
          << i.originZ << "],\n"
          << "\"rectheta\":" << ei.rectheta << ",\n"
          << "\"recphi\":" << ei.recphi << ",\n"
          << "\"pka\": [" << ei.xrec << ", " << ei.yrec << ", "
          << ei.zrec << "],\n"
          << "\"latticeConst\":" << i.latticeConst << ",\n"
          << "\"temperature\":" << i.temperature << ",\n"
          << "\"infile\": \"" << ei.infile << "\",\n"
          << "\"tags\": \"" << ei.tags << "\",\n"
          << "\"potentialUsed\": \"" << ei.potentialUsed << "\",\n"
          << "\"author\": \"" << ei.author << "\",\n"
          << "\"isPkaGiven\":" << ei.isPkaGiven << ",\n"
          << "\"es\":" << ei.es << ",\n"
          << "\"originType\":" << i.originType; // << ",\n";
}

void av::configToKeyValue(std::ostream &outfile,
                                const av::Config &c) {
  outfile << "\"version\": \"" << "0.4" << "\",\n"
          << "\"onlyDefects\": \"" << c.onlyDefects << "\",\n"
          << "\"isFindDistribution\": \"" << c.isFindDistribAroundPKA << "\",\n"
          << "\"isFindClusterFeatures\": \"" << c.isFindClusterFeatures << "\",\n"
          << "\"isIgnoreBoundaryDefects\": \"" << c.isIgnoreBoundaryDefects << "\",\n"
          << "\"isAddThresholdDefects\": \""
          << c.isAddThresholdDefects << "\",\n"
          << "\"filterZeroSizeClusters\":" << c.filterZeroSizeClusters << ",\n"
          << "\"thresholdFactor\":" << c.thresholdFactor << ",\n"
          << "\"logMode\":" << c.logMode << ",\n"
          << "\"logFilPath\": \"" << c.logFilePath << "\",\n"
          << "\"outputJSONFilePath\": \"" << c.outputJSONFilePath << "\""; // << ",\n";
}

void av::printJson(std::ostream &outfile, const av::InputInfo &i,
                         const av::ExtraInfo &ei,
                         const av::resultsT &res) {
  outfile << "{";
  av::infoToKeyValue(outfile, i, ei);
  outfile << ",\n";
  av::resToKeyValue(outfile, res);
  outfile << "}\n";
}
// const char * c = outfile.str().c_str();
