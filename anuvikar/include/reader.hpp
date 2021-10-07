/*!
 * @file
 * functions to read parcas input file and xyz file and use other
 * functions to get the results and print them.
 * */

#ifndef PARCASREADER_ANUVIKAR_HPP
#define PARCASREADER_ANUVIKAR_HPP

#include <string>

#include <xyzReader.hpp>
#include <cluster2features.hpp>
#include <helper.hpp>
#include <results.hpp>

namespace av {

std::pair<av::xyzFileStatus, av::ErrorStatus> processTimeFile(av::InputInfo &info,
                                     av::ExtraInfo &extraInfo,
                                     const av::Config &config, std::istream &infile, av::frameStatus &fs, std::ostream &outfile, bool isFirst);

std::pair<av::ErrorStatus,int> processFileTimeCmd(std::string xyzfileName,
                                            std::ostream &outfile,
                                            const Config &config, int id, const av::InputInfo&, const av::ExtraInfo&, bool);
 
}
#endif