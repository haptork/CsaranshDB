/*!
 * @file
 * class for calculating offset & closest lattice site of an atom
 * */
#ifndef ADDOFFSET_ANUVIKAR_HPP
#define ADDOFFSET_ANUVIKAR_HPP

#include <array>
#include <string>
#include <tuple>
#include <vector>

namespace avi {

using offsetCoords = std::tuple<std::array<double, 3>, double, std::array<double, 3>>;

class AddOffset {
public:
  AddOffset(double latConst, std::string lattice, std::array<double, 3> origin);
  offsetCoords operator()(const std::array<double, 3> &coords);

private:
  bool _isUnitcell(double x, double y, double z, double l,
                   std::array<double, 3> origin);
  void _bccUnitcell();
  void _fccUnitcell();
  double _calcDistMirror(std::array<long double, 3> a,
                         std::array<long double, 3> b, long double size,
                         std::array<int, 3> &mirror);

  std::vector<std::array<long double, 3>> _sites;
  std::array<long double, 3> _origin;
  long double _latConst;
  long double roundOffTo = 10000.0;
};
} // namespace avi

#endif // ADDOFFSET_ANUVIKAR_HPP
