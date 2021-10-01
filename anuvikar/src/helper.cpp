#include <string>

#include <helper.hpp>

std::string anuvikar::errToStr(anuvikar::ErrorStatus err) {
  if (err == anuvikar::ErrorStatus::inputFileMissing) {
    return "Could not read input file; You can make a common_input.in file in "
           "current dir.";
  } else if (err == anuvikar::ErrorStatus::InputFileincomplete) {
    return "Input file doesn't have all the info; Refer the sample input files "
           "in examples.";
  } else if (err == anuvikar::ErrorStatus::inputFileReadError) {
    return "Input file read error.";
  } else if (err == anuvikar::ErrorStatus::xyzFileDefectsProcessingError) {
    return "XYZ file has too many defects or zero atoms";
  } else if (err == anuvikar::ErrorStatus::xyzFileMissing || err == anuvikar::ErrorStatus::xyzFileReadError) {
    return "XYZ file can not be read, it might be missing.";
  } else if (err == anuvikar::ErrorStatus::unknownSimulator) {
    return "Input file doesn't have LAMMPS/PARCAS/DISPLACED simulation input "
           "type; Refer the sample input files in examples.";
  } else if (err == anuvikar::ErrorStatus::vacOverflow) {
    return "Too many vacancies, might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == anuvikar::ErrorStatus::siaOverflow) {
    return "Too many interstitials, might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == anuvikar::ErrorStatus::defectOverflow) {
    return "Too many defects, might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == anuvikar::ErrorStatus::threshOverflow) {
    return "Too many threshold based defects, might be due to wrong lattice constant or offset.";
  } else if (err == anuvikar::ErrorStatus::siaVacDiffOverflow) {
    return "huge difference in number of interstitials & vacancies. Might be due to wrong lattice constant or offset. Also, try ignoring boundaries with -sb switch.";
  } else if (err == anuvikar::ErrorStatus::noError) {
    return "success.";
  }
  return "Unknown Error.";
}
