
/*!
 * @file
 * Functions to correct the origin to minimize the overall offset of all the
 * atoms
 * */

#ifndef OPTIMIZEORIGIN_ANUVIKAR_HPP
#define OPTIMIZEORIGIN_ANUVIKAR_HPP

#include <helper.hpp>

namespace anuvikar {

Coords correctOrigin(const std::vector<anuvikar::Coords> &atoms,
                     anuvikar::Coords origin, double latConst);

Coords estimateOrigin(const std::vector<anuvikar::Coords> &atoms,
                      const double &latConst);

} // namespace anuvikar
#endif
