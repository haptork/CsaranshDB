import _extends from '@babel/runtime/helpers/esm/extends';
import * as THREE from 'three';
//import * as React from 'react';
import React, {useLayoutEffect} from 'react';
import { useFrame, extend } from '@react-three/fiber';
import mergeRefs from 'react-merge-refs';
//import { Position } from '../helpers/Position.js';

class Position extends THREE.Group {
  constructor() {
    super();
    this.color = new THREE.Color('white');
  }

}

let i, positionRef;
const context = /*#__PURE__*/React.createContext(null);
const parentMatrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const color = new THREE.Color();
const Points = /*#__PURE__*/React.forwardRef(({
  children,
  range,
  limit = 1000,
  ...props
}, ref) => {
  const parentRef = React.useRef(null);
  const [refs, setRefs] = React.useState([]);
  const [[positions, colors]] = React.useState(() => [new Float32Array(limit * 3), new Float32Array([...new Array(limit * 4)].map(() => 1))]);
  //console.log("init", colors);
  React.useLayoutEffect(() => {
    parentRef.current.geometry.drawRange.count = Math.min(limit, range !== undefined ? range : limit, refs.length);
    fn();
  }, [refs, range]);
  React.useEffect(() => {
    // We might be a frame too late? 🤷‍♂️
    parentRef.current.geometry.attributes.position.needsUpdate = true;
  });
  const fn = () => {
    parentRef.current.updateMatrix();
    parentRef.current.updateMatrixWorld();
    parentMatrix.copy(parentRef.current.matrixWorld).invert();

    //console.log("init points:", colors);
    for (i = 0; i < refs.length; i++) {
      positionRef = refs[i].current;
      if (!positionRef) continue;
      positionRef.getWorldPosition(position).applyMatrix4(parentMatrix);

      if (position.x !== positions[i * 3] || position.y !== positions[i * 3 + 1] || position.z !== positions[i * 3 + 2]) {
        position.toArray(positions, i * 3);
        parentRef.current.geometry.attributes.position.needsUpdate = true;
        positionRef.matrixWorldNeedsUpdate = true;
      }

      if (!positionRef.color.equals(color.fromArray(colors, i * 4))) {
        //console.log("posRef: ", positionRef);
        positionRef.color.toArray(colors, i * 4);
        if(positionRef.opacity) colors[i*4+3] = positionRef.opacity;
        parentRef.current.geometry.attributes.color.needsUpdate = true;
      }
    }
    //console.log("points:", colors);
  };
  const events = React.useMemo(() => {
    const events = {};

    for (i = 0; i < refs.length; i++) {
      var _refs$i$current;

      Object.assign(events, (_refs$i$current = refs[i].current) == null ? void 0 : _refs$i$current.__r3f.handlers);
    }

    return Object.keys(events).reduce((prev, key) => ({ ...prev,
      [key]: e => {
        var _refs$e$index$current, _refs$e$index$current2, _refs$e$index$current3;

        return (_refs$e$index$current = refs[e.index].current) == null ? void 0 : (_refs$e$index$current2 = _refs$e$index$current.__r3f) == null ? void 0 : (_refs$e$index$current3 = _refs$e$index$current2.handlers) == null ? void 0 : _refs$e$index$current3[key](e);
      }
    }), {});
  }, [refs]);
  const api = React.useMemo(() => ({
    subscribe: ref => {
      setRefs(refs => [...refs, ref]);
      return () => setRefs(refs => refs.filter(item => item.current !== ref.current));
    }
  }), []);
  return /*#__PURE__*/React.createElement("points", _extends({
    matrixAutoUpdate: false,
    ref: mergeRefs([ref, parentRef])
  }, events, props), /*#__PURE__*/React.createElement("bufferGeometry", null, /*#__PURE__*/React.createElement("bufferAttribute", {
    attachObject: ['attributes', 'position'],
    count: positions.length / 3,
    array: positions,
    itemSize: 3
  }), /*#__PURE__*/React.createElement("bufferAttribute", {
    attachObject: ['attributes', 'color'],
    count: colors.length / 4,
    array: colors,
    itemSize: 4
  })), /*#__PURE__*/React.createElement(context.Provider, {
    value: api
  }, children));
});
const Point = /*#__PURE__*/React.forwardRef(({
  children,
  ...props
}, ref) => {
  React.useMemo(() => extend({
    Position
  }), []);
  const group = React.useRef();
  const {
    subscribe
  } = React.useContext(context);
  React.useLayoutEffect(() => subscribe(group), []);
  return /*#__PURE__*/React.createElement("position", _extends({
    ref: mergeRefs([ref, group])
  }, props), children);
});

export { Point, Points };
