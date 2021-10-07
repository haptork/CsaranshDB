
/*!
 * @file
 * Functions to correct the origin to minimize the overall offset of all the
 * atoms
 * */

#ifndef OPTIMIZEORIGIN_ANUVIKAR_HPP
#define OPTIMIZEORIGIN_ANUVIKAR_HPP

#include <helper.hpp>

namespace av {

Coords correctOrigin(const std::vector<av::Coords> &atoms,
                     av::Coords origin, double latConst);

Coords estimateOrigin(const std::vector<av::Coords> &atoms,
                      const double &latConst);

} // namespace av
#endif
