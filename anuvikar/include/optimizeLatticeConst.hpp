/*!
 * @file
 * functions that finds lattice constant value that gives minimum offset
 * */

#ifndef OPTIMIZELATCONST_ANUVIKAR_HPP
#define OPTIMIZELATCONST_ANUVIKAR_HPP

#include <vector>

#include <helper.hpp>

namespace anuvikar {

constexpr auto atomsToIgnore = 1000LL;

double optimizeForOffset(std::vector<anuvikar::Coords> &atoms,
                         double minLatConst, double maxLatConst, double step);

double optimizeLatConst(std::vector<anuvikar::Coords> &atoms, double latConst);

} // namespace anuvikar
#endif
