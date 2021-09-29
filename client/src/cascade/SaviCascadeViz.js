import * as THREE from 'three';
import React, { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { OrbitControls, PointMaterial, TransformControls, useHelper, useTexture, Sphere, MeshDistortMaterial} from '@react-three/drei';
//import {Points, Point, PointMaterial } from '@react-three/drei';
import { Points, Point } from './Points.js';
import { Canvas, useFrame, useUpdate } from '@react-three/fiber';
//import { BoxGeometry, BufferAttribute, BufferGeometry, MeshBasicMaterial, PointLightShadow,  } from 'three';
//import niceColors from 'nice-color-palettes';
//import Effects from './Effects'

import { useThree} from '@react-three/fiber';

function useMyHelper(object3D, ar, ...args) {
  const helper = React.useRef();
  const scene = useThree(state => state.scene);
  React.useEffect(() => {

    //console.log(object3D.current.geometry.boundingBox);
    //object3D.current.geometry.computeBoundingBox ();
    //console.log(object3D.current.geometry);
    //console.log(object3D.current.geometry.boundingBox);
    if (object3D.current) {

      //helper.current = new proto(object3D.current, ...args);
      object3D.current.geometry.computeBoundingBox ();
      const box = new THREE.Box3().setFromArray(ar);
      console.log(box);
      helper.current = new THREE.Box3Helper(box, 0xffff00);
      console.log(helper.current);
      if (helper.current) {
        scene.add(helper.current);
      }
    }

    return () => {
      if (helper.current) {
        scene.remove(helper.current);
      }
    };
  }, [scene, object3D, args]);
  useFrame(() => {
    if (helper.current) {
      //helper.current.update();
    }
  });
  return helper;
}

const getPairColorOrient = x => {
  if (x === undefined) return (0.1, 0.1, 0.2);
  const i = Math.round(200 * x[0]);
  const j = Math.round(200 * x[1]);
  //const hexCode = rgbToHex(120, j, 50 + i);
  return [120/255, i/255, (255 - j)/255];
}


function Sia(props) {
  return(
      <Points 
       limit={props.points.length} 
       range={props.points.length}
      >
      <pointsMaterial size={props.size} vertexColors={true} attach="material" map={props.texture} sizeAttenuation={props.sa} transparent={true} alphaTest={0.2}/>
        {props.points.map((pointProps, i) => <Point key={i} {...pointProps} />)}
      </Points>
  );
}
/*
function CompBoxedInstanced(props) {
 const [hovered, setHover] = useState(-1);
 const [active, setActive] = useState(-1);
 const colorAr = useMemo(() => {
   const allColors = [];
   for (const color of props.colors) {
     allColors.push(color);
   }
   return Float32Array(allColors);
 }, [props.colors]);
 useFrame((state) => {

 });
 const meshRef = useRef();
  return(
    <instancedMesh ref={meshRef} args={[null, null, props.count]}
      onClick={(e)=> setActive(e.instanceId)}
      onPointerOver={(e)=> setHover(e.instanceId)}
      onPointerOut={(e)=> setHover(e.instanceId)}>
      <boxGeometry args={props.size}>
        <instancedBufferAttribute attachObject={["attributes", "color"]} args={[colorAr, 3]} />
      </boxGeometry>
      <meshStandardMaterial transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={props.color} />
    </instancedMesh>
  );
}
*/
function CompBoxed(props) {
 const [hovered, setHover] = useState(false);
 const [active, setActive] = useState(false);
  return(
      <mesh 
      position={props.position}
      scale={active ? 1.5 : 1}
      onClick={(e)=> setActive(!active) }
      onPointerOver={(e)=> setHover(true) }
      onPointerOut={(e)=> setHover(false) }
      >
        <boxGeometry args={props.size} />
        <MeshDistortMaterial speed={1.9} distort={0.5} transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={props.color} />
      </mesh>
  );
}
        //<meshLambertMaterial transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={props.color} />

function CompSphere(props) {
 const [hovered, setHover] = useState(false);
 const [active, setActive] = useState(false);
 const radius = Math.min(...props.size);
  return(
      <mesh 
      position={props.position}
      scale={active ? 1.5 : 1}
      onClick={(e)=> setActive(!active) }
      onPointerOver={(e)=> setHover(true) }
      onPointerOut={(e)=> setHover(false) }
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhongMaterial transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={props.color} />
      </mesh>
  );
}

function CompDistort1(props) {
 const [hovered, setHover] = useState(false);
 const [active, setActive] = useState(false);
 const radius = Math.min(...props.size);
  return(
      <mesh 
      position={props.position}
      scale={active ? 1.5 : 1}
      onClick={(e)=> setActive(!active) }
      onPointerOver={(e)=> setHover(true) }
      onPointerOut={(e)=> setHover(false) }
      >
        <icosahedronGeometry args={[radius, 4, 4]} />
        <MeshDistortMaterial speed={1.0} distort={0.6} transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={props.color} />
      </mesh>
  );
}

function CompDistort2(props) {
 const [hovered, setHover] = useState(false);
 const [active, setActive] = useState(false);
 //console.log("shpere", props)
 //const radius = Math.min(...props.size);
 //console.log("shpere", props, radius)
  return(
      <mesh 
      position={props.position}
      scale={active ? 1.5 : 1}
      onClick={(e)=> setActive(!active) }
      onPointerOver={(e)=> setHover(true) }
      onPointerOut={(e)=> setHover(false) }
      >
        <boxGeometry args={props.size} />
        <MeshDistortMaterial speed={0.0} distort={0.6} transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={props.color} />
      </mesh>
  );
}

function CompVac(props) {
 const [hovered, setHover] = useState(false);
 const [active, setActive] = useState(false);
 console.log("shpere", props)
 let radius = Math.min(...props.size);
 if (radius < 2) radius *= 2.0;
 if (radius > 20) radius *= 0.8;
 console.log("shpere", props, radius)
 const curColor = [0.9, 0.8, 0.1];
  return(
      <mesh 
      position={props.position}
      scale={active ? 1.2 : 1.0}
      onClick={(e)=> setActive(!active) }
      onPointerOver={(e)=> setHover(true) }
      onPointerOut={(e)=> setHover(false) }
      >
        <icosahedronGeometry args={[radius]} />
        <meshLambertMaterial transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={curColor} />
      </mesh>
  );
}
        //<cylinderGeometry args={[radius, radius, radius , 6]} />

function SiaBoxed(props) {
  const siaRef = useRef();
  //useMyHelper(siaRef, props.ar, "blue");
  /*
  useEffect(()=> {
    siaRef.current.geometry.computeBoundingBox();
    siaRef.current.geometry.computeBoundingBox();
    siaRef.current.geometry.computeBoundingBox();
    siaRef.current.geometry.computeBoundingBox();
    console.log(siaRef.current.geometry);
    if (siaRef.current.geometry.boundingBox == null) {
      console.log("null")
    } else {
      console.log("x", siaRef.current.geometry.boundingBox.min.x);
    }
    if (siaRef.current.geometry.boundingSphere == null) {
      console.log("null")
    } else {
      console.log("r", siaRef.current.geometry.boundingSphere.radius);
    }
  })
  useFrame(() => {
    //siaRef.current.geometry.computeBoundingBox();
  });
  */
 const [hovered, setHover] = useState(true);
 const [active, setActive] = useState(false);
  return(
    <>
      <Points ref={siaRef}
       limit={props.points.length} 
       range={props.points.length}
      >
      <pointsMaterial size={props.size} vertexColors={true} attach="material" map={props.texture} sizeAttenuation={props.sa} transparent={true} alphaTest={0.2}/>
        {props.points.map((pointProps, i) => <Point key={i} {...pointProps} />)}
      </Points>
      <mesh 
      position={props.boxProps.position}
      scale={active ? 1.5 : 1}
      onClick={(e)=> setActive(!active) }
      onPointerOver={(e)=> setHover(true) }
      onPointerOut={(e)=> setHover(false) }
      >
        <boxGeometry args={props.boxProps.size} />
        <meshStandardMaterial transparent={true} opacity={hovered || active ? 0.6 : 0.15} color={props.color} />
      </mesh>
      </>
  );
}
/*
function TestBoxed(props) {
  //const ref = React.useRef();
  //useHelper(ref, THREE.BoxHelper, 'royalblue');
 return (
    <mesh>
      <MeshBasicMaterial/>
    </mesh>
 );
}
*/
const CubeWithHelpers = () => {
  const cubeRef = useRef();
  //useMyHelper(cubeRef, THREE.BoxHelper, "blue");
  //useHelper(cubeRef, VertexNormalsHelper, 1, "green");
  //useHelper(cubeRef, FaceNormalsHelper, 0.5, "yellow");
/*
  useFrame(() => {
    cubeRef.current.rotation.x += 0.01;
    cubeRef.current.rotation.y += 0.01;
  });
*/
  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshLambertMaterial color={"red"} />
    </mesh>
  );
};

function defectItems(coords, lines, allComps, sias, vacs, meshProps, label) {
  //const sias = [];
  //const vacs = [];
  //const meshProps = [];
  let i = 0;
  for (const comps of allComps) { // TODO pointsI and pointsV
    for (const comp of comps) {
      //console.log(comp[2]);
      const points = [];
      const totalColor = [0.0, 0.0]
      for (const lIndex of comp[2]) {
        let line;
        if (lIndex >= lines.lines.length) {
          const nuIndex = lIndex - lines.lines.length;
          if (nuIndex > lines.linesT.length) continue;
          line = lines.linesT[nuIndex]
        } else {
          line = lines.lines[lIndex];
        }
        const curColor = getPairColorOrient(line.orient);
        totalColor[0] += line.orient[0];
        totalColor[1] += line.orient[1];
        for (const cIndex of line.main) {
          const c = coords[cIndex];
          if (i < 4) points.push(c[0]); points.push(c[1]); points.push(c[2]);
          if (c[3] == 1) {
            sias.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.9:0.4)});
          } else {
            vacs.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.9:0.4)});
          }
        }
      }
      if (i < 4 && points.length >0) {
        totalColor[0] /= comp[2].length;
        totalColor[1] /= comp[2].length;
        const totalColorVal = getPairColorOrient(totalColor);
        const pointsAr = new Float32Array(points);
        const boxExtent = new THREE.Box3().setFromArray(pointsAr);
        const diffOf = (key) => (boxExtent.max[key] - boxExtent.min[key]);
        const midOf = (key) => (boxExtent.max[key] + boxExtent.min[key])/2.0;
        const boxProps = {position:[midOf('x'), midOf('y'), midOf('z')], size:[diffOf('x'), diffOf('y'), diffOf('z')]};
        //console.log(pointsAr);
        //console.log(boxExtent);
        meshProps[i].push({...boxProps, color:totalColorVal})
      }
    }
    for (const cIndex of lines.pointsV) {
      const c = coords[cIndex];
      vacs.push({position:[c[0], c[1], c[2]], color:[0.1, 0.1, 0.1], opacity:((c[5]==1)?0.9:0.4)});
    }
    for (const cIndex of lines.pointsI) {
      const c = coords[cIndex];
      sias.push({position:[c[0], c[1], c[2]], color:[0.1, 0.1, 0.1], opacity:((c[5]==1)?0.9:0.4)});
    }
    i++;
  }
  //return [sias, vacs, meshProps]
}

function vacClusters(coords, clusterPoints, sias, vacs, meshProps, label) {
  const points = [];
  for (const cIndex of clusterPoints) { // TODO pointsI and pointsV
    const c = coords[cIndex];
    const curColor = [1.0, 0.8, 0.1];
    points.push(c[0]); points.push(c[1]); points.push(c[2]);
    if (c[3] == 1) {
      sias.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.9:0.4)});
    } else {
      vacs.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.9:0.4)});
    }
  }
  if (points.length < 2) return;
  const pointsAr = new Float32Array(points);
  const boxExtent = new THREE.Box3().setFromArray(pointsAr);
  const diffOf = (key) => (boxExtent.max[key] - boxExtent.min[key]);
  const midOf = (key) => (boxExtent.max[key] + boxExtent.min[key])/2.0;
  const boxProps = {position:[midOf('x'), midOf('y'), midOf('z')], size:[diffOf('x'), diffOf('y'), diffOf('z')]};
  meshProps.push(boxProps)
}

function DrawClusters({textures, coords, lines, comps, clusters, clusterSizes}) {
  const sias = [];
  const vacs = [];
  const meshProps = [[], [], [], [], []];
  for (const clusterLabel in comps) {
    defectItems(coords, lines[clusterLabel], comps[clusterLabel], sias, vacs, meshProps, clusterLabel);
  }
  for (const clusterLabel in clusters) {
    if (clusterSizes[clusterLabel] > -1) continue;
    vacClusters(coords, clusters[clusterLabel], sias, vacs, meshProps[4], clusterLabel);
  }
  //console.log(meshProps);
  // TODO use type info in meshProps for different shapes
  // TODO use meshInstance.
  return(
   <>
    <Sia points={sias} size={2} sa={true} texture={textures[0]} />
    <Sia points={vacs} size={2} sa={true} texture={textures[1]} />
    {meshProps[0].map((p, i) => <CompBoxed key={i} {...p} />)}
    {meshProps[1].map((p, i) => <CompSphere key={i} {...p} />)}
    {meshProps[2].map((p, i) => <CompDistort1 key={i} {...p} />)}
    {meshProps[3].map((p, i) => <CompDistort2 key={i} {...p} />)}
    {meshProps[4].map((p, i) => <CompVac key={i} {...p} />)}
   </> 
  );
}

    //<SiaBoxed texture={texture} points={sias} ar={pointsAr} boxProps={boxProps} sa={true} size={2}/>

export function DrawIt(props) {
   const [label, setLabel] = useState("shunyam");
   return (
     <>
    <React.Suspense fallback={null}>
   <DrawCanvas setLabel={setLabel} {...props} />
    </React.Suspense>
    <p>
      {label}
    </p>
    </>
   );
}
export function DrawCanvas({coords, lines, comps, setLabel, clusters, clusterSizes}) {
  // let nSingleSias = 0; // for meshedInstance
  // let nSingleVacs = 0; // for sprite buffer geometry
  const sias = [];
  const vacs = [];
  const showInfoOf = (index) => {
    setLabel("clicked " +  index);
  }

  const onClickFnSia = (event) => {
    if (event.intersections.length == 0) return;
    let minDist = event.intersections[0].distanceToRay;
    let minIndex = event.intersections[0].index;
    for (let i = 1; i < event.intersections; i++) {
      if(event.intersections[i].distanceToRay < minDist) {
        minDist = event.intersections[i].distanceToRay;
        minIndex = event.intersections[i].index;
      }
    }
    if (minDist < 1.0) showInfoOf(minIndex);
    event.stopPropagation();
  }
  for (const c of coords) {
    if (c[4] > 0) continue; // cluster 
    if (c[3] == 1) {
      //nSingleSias++;
      sias.push({position:[c[0], c[1], c[2]], color:[0.9, 0.2, 0.1], opacity:((c[5]==1)?0.9:0.4), onClick:onClickFnSia});
    }
    else {
      //nSingleVacs++;
      vacs.push({position:[c[0], c[1], c[2]], color:[0.9, 0.2, 0.1], opacity:((c[5]==1)?0.9:0.4), onClick:onClickFnSia});
    }
  }
  const [texture1, texture2] = useTexture(["textures/metalatom.png", "textures/vacancy.png"])
  return (
    <Canvas
    linear
    gl={{ antialias: false, alpha: false }}
    camera={{ position: [0, 0, 60], near: 1, far: 1000 }}
    onCreated={({ gl }) => gl.setClearColor('#f0f0f0')}>
    <ambientLight />
    <pointLight position={[150, 150, 150]} intensity={0.55} />
    <Sia texture={texture1} points={sias} sa={true} size={2}/>
    <Sia texture={texture2} points={vacs} sa={true} size={2}/>
    <DrawClusters textures={[texture1, texture2]} coords={coords} lines={lines} comps={comps} clusters={clusters} clusterSizes={clusterSizes}/>
    <OrbitControls/>
    </Canvas>

  );
    //
}


    //
    /*

    <ambientLight />
    <pointLight position={[150, 150, 150]} intensity={0.55} />
    */
