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

namespace anuvikar {

std::pair<anuvikar::xyzFileStatus, anuvikar::ErrorStatus> processTimeFile(anuvikar::InputInfo &info,
                                     anuvikar::ExtraInfo &extraInfo,
                                     const anuvikar::Config &config, std::istream &infile, anuvikar::frameStatus &fs, std::ostream &outfile, bool isFirst);

std::pair<anuvikar::ErrorStatus,int> processFileTimeCmd(std::string xyzfileName,
                                            std::ostream &outfile,
                                            const Config &config, int id, const anuvikar::InputInfo&, const anuvikar::ExtraInfo&, bool);
 
}
#endif