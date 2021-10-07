/*!
 * @file
 * functions to read parcas input file and xyz file and use other
 * functions to get the results and print them.
 * */

#ifndef XYZREADER_ANUVIKAR_HPP
#define XYZREADER_ANUVIKAR_HPP

#include <map>
#include <string>

#include <helper.hpp>

namespace av {

constexpr auto maxColumnsTry = 50;

enum class frameStatus : bool { prelude, inFrame };

enum class lineStatus : int { garbage, coords, inFrameCoords, frameBorder };

std::pair<av::lineStatus, av::Coords>
getCoord(const std::string &line, const av::frameStatus &fs,
         const av::InputInfo &info, const av::ExtraInfo &ei);

std::pair<av::lineStatus, av::Coords>
getCoordLammps(const std::string &line, const av::frameStatus &fs, int);

std::pair<av::lineStatus, av::Coords>
getCoordParcas(const std::string &line, const av::frameStatus &fs, int);

std::pair<av::lineStatus, std::array<av::Coords, 2>>
getCoordDisplaced(const std::string &line);

} // namespace av
#endif