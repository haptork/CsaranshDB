#include <string>

#include <helper.hpp>

std::string av::errToStr(av::ErrorStatus err) {
  if (err == av::ErrorStatus::inputFileMissing) {
    return "Could not read input file; You can make a common_input.in file in "
           "current dir.";
  } else if (err == av::ErrorStatus::InputFileincomplete) {
    return "Input file doesn't have all the info; Refer the sample input files "
           "in examples.";
  } else if (err == av::ErrorStatus::inputFileReadError) {
    return "Input file read error.";
  } else if (err == av::ErrorStatus::xyzFileDefectsProcessingError) {
    return "XYZ file has too many defects or zero atoms";
  } else if (err == av::ErrorStatus::xyzFileMissing || err == av::ErrorStatus::xyzFileReadError) {
    return "XYZ file can not be read, it might be missing.";
  } else if (err == av::ErrorStatus::unknownSimulator) {
    return "Input file doesn't have LAMMPS/PARCAS/DISPLACED simulation input "
           "type; Refer the sample input files in examples.";
  } else if (err == av::ErrorStatus::vacOverflow) {
    return "Too many vacancies, might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == av::ErrorStatus::siaOverflow) {
    return "Too many interstitials, might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == av::ErrorStatus::defectOverflow) {
    return "Too many defects, might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == av::ErrorStatus::threshOverflow) {
    return "Too many threshold based defects, might be due to wrong lattice constant or offset.";
  } else if (err == av::ErrorStatus::siaVacDiffOverflow) {
    return "huge difference in number of interstitials & vacancies. Might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == av::ErrorStatus::noError) {
    return "success.";
  }
  return "Unknown Error.";
}
