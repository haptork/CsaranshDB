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
    anuvikar::writeVector(it.second, outfile);
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

void printSingleFeat(const anuvikar::featT &feats, std::ostream &outfile) {
  outfile << "\"dist\": ";
  outfile << "[";
  anuvikar::writeStdAr(std::get<0>(feats), outfile);
  outfile << "],\n";
  outfile << "\"angle\": ";
  outfile << "[";
  anuvikar::writeStdAr(std::get<1>(feats), outfile);
  /*
  outfile << "],\n";
  outfile << "\"adjNn2\": ";
  outfile << "[";
  anuvikar::writeStdAr(std::get<2>(feats), outfile);
  */
  outfile << "]\n";
}

void printFeats(const std::unordered_map<int, anuvikar::featT> &feats,
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

auto strSimulationCode(anuvikar::XyzFileType code) {
  return (code == anuvikar::XyzFileType::cascadesDbLikeCols)
             ? "cascadesDbLikeCols"
             : (code == anuvikar::XyzFileType::lammpsWithStdHeader)
                   ? "lammpsWithStdHeader"
                   : (code == anuvikar::XyzFileType::parcasWithStdHeader)
                      ? "parcasWithStdHeader"
                      : (code == anuvikar::XyzFileType::lammpsDisplacedCompute)
                        ? "lammpsDisp"
                        : "generic-XYZ";
}

std::string errorStr(anuvikar::ErrorStatus err) {
  if (err == anuvikar::ErrorStatus::inputFileMissing) {
    return "Could not read input file";
  } else if (err == anuvikar::ErrorStatus::inputFileMissing) {
    return "Could not read input file";
  } else if (err == anuvikar::ErrorStatus::InputFileincomplete) {
    return "Input file doesn't have all the info";
  } else if (err == anuvikar::ErrorStatus::unknownSimulator) {
    return "Input file doesn't have LAMMPS/PARCAS/DISPLACED simulation input "
           "type";
  } else if (err == anuvikar::ErrorStatus::xyzFileDefectsProcessingError) {
    return "XYZ file has too many defects or zero atoms";
  }
  return "";
}

void anuvikar::resToKeyValue(std::ostream &outfile,
                             const anuvikar::resultsT &res) {
  auto printDefects = [&outfile](const anuvikar::DefectVecT &d) {
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
  anuvikar::writeVector(res.coDefects, outfile);
  outfile << "]\n";
}

void anuvikar::infoToKeyValue(std::ostream &outfile,
                              const anuvikar::InputInfo &i,
                              const anuvikar::ExtraInfo &ei) {
  outfile << "\"xyzFilePath\": \"" << i.xyzFilePath << "\",\n"
          << "\"id\": \"" << ei.id << "\",\n"
          << "\"substrate\": \"" << ei.substrate << "\",\n"
          << "\"simulationCode\": \"" << strSimulationCode(i.xyzFileType)
          << "\",\n"
          << "\"energy\":" << ei.energy << ",\n"
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

void anuvikar::configToKeyValue(std::ostream &outfile,
                                const anuvikar::Config &c) {
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

void anuvikar::printJson(std::ostream &outfile, const anuvikar::InputInfo &i,
                         const anuvikar::ExtraInfo &ei,
                         const anuvikar::resultsT &res) {
  outfile << "{";
  anuvikar::infoToKeyValue(outfile, i, ei);
  outfile << ",\n";
  anuvikar::resToKeyValue(outfile, res);
  outfile << "}\n";
}
// const char * c = outfile.str().c_str();
