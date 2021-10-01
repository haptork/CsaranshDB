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

namespace anuvikar {

constexpr auto maxColumnsTry = 50;

enum class frameStatus : bool { prelude, inFrame };

enum class lineStatus : int { garbage, coords, inFrameCoords, frameBorder };

std::pair<anuvikar::lineStatus, anuvikar::Coords>
getCoord(const std::string &line, const anuvikar::frameStatus &fs,
         const anuvikar::InputInfo &info, const anuvikar::ExtraInfo &ei);

std::pair<anuvikar::lineStatus, anuvikar::Coords>
getCoordLammps(const std::string &line, const anuvikar::frameStatus &fs, int);

std::pair<anuvikar::lineStatus, anuvikar::Coords>
getCoordParcas(const std::string &line, const anuvikar::frameStatus &fs, int);

std::pair<anuvikar::lineStatus, std::array<anuvikar::Coords, 2>>
getCoordDisplaced(const std::string &line);

} // namespace anuvikar
#endif