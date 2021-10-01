import * as THREE from 'three';
import React, { useState } from 'react';
import { OrbitControls, useTexture, MeshDistortMaterial} from '@react-three/drei';
import { Points, Point } from './SaviCascadeVizHelper';
import { Canvas} from '@react-three/fiber';


const getPairColorOrient = x => {
  if (x === undefined) return (0.1, 0.1, 0.2);
  const i = Math.round(200 * x[0]);
  const j = Math.round(200 * x[1]);
  //const hexCode = rgbToHex(120, j, 50 + i);
  return [120/255, i/255, (255 - j)/255];
}

function Sia(props) {
  console.log(props.points.length);
  console.log(props.points.length);
  return(
      <Points 
       limit={10000} 
       range={10000}
      >
      <pointsMaterial size={props.size} vertexColors={true} attach="material" map={props.texture} sizeAttenuation={props.sa} transparent={true} alphaTest={0.2}/>
        {props.points.map((pointProps, i) => <Point key={i} {...pointProps} />)}
      </Points>
  );
}

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
        <meshStandardMaterial transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={props.color} />
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
 const clickFn = (e) => {
   console.log("clicked vlabel", props.label)
   setActive(!active)
 };
  return(
      <mesh 
      position={props.position}
      scale={active ? 1.2 : 1.0}
      onClick={clickFn}
      onPointerOver={(e)=> setHover(true) }
      onPointerOut={(e)=> setHover(false) }
      >
        <icosahedronGeometry args={[radius]} />
        <meshLambertMaterial transparent={true} opacity={hovered || active ? 0.6 : 0.2} color={curColor} />
      </mesh>
  );
}
        //<cylinderGeometry args={[radius, radius, radius , 6]} />

function defectItems(coords, lines, allComps, sias, vacs, meshProps, label) {
  //const sias = [];
  //const vacs = [];
  //const meshProps = [];
  let i = 0;
  for (const comps of allComps) { // TODO pointsI and pointsV
    for (const comp of comps) {
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
            sias.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.7:0.4)});
          } else {
            vacs.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.7:0.4)});
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
  /*
  if (label == 75) {
      console.log(vacs.length);
  }
  */
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
  if (label == 75) {
      console.log(points);
      console.log(vacs.length);
  }
  if (points.length < 2) return;
  const pointsAr = new Float32Array(points);
  const boxExtent = new THREE.Box3().setFromArray(pointsAr);
  const diffOf = (key) => (boxExtent.max[key] - boxExtent.min[key]);
  const midOf = (key) => (boxExtent.max[key] + boxExtent.min[key])/2.0;
  const boxProps = {label: label, position:[midOf('x'), midOf('y'), midOf('z')], size:[diffOf('x'), diffOf('y'), diffOf('z')]};
  meshProps.push(boxProps)
}

function DrawClusters({meshProps}) {
  // TODO use type info in meshProps for different shapes
  // TODO use meshInstance.
  return(
   <>
    {meshProps[0].map((p, i) => <CompBoxed key={i} {...p} />)}
    {meshProps[1].map((p, i) => <CompSphere key={i} {...p} />)}
    {meshProps[2].map((p, i) => <CompDistort1 key={i} {...p} />)}
    {meshProps[3].map((p, i) => <CompDistort2 key={i} {...p} />)}
    {meshProps[4].map((p, i) => <CompVac key={i} {...p} />)}
    </>
  );
  /*
  return(
   <>
    <Sia points={sias} size={2} sa={true} texture={textures[0]} />
    <SiaDebug points={vacs} size={2} sa={true} texture={textures[1]} />
    {meshProps[0].map((p, i) => <CompBoxed key={i} {...p} />)}
    {meshProps[1].map((p, i) => <CompSphere key={i} {...p} />)}
    {meshProps[2].map((p, i) => <CompDistort1 key={i} {...p} />)}
    {meshProps[3].map((p, i) => <CompDistort2 key={i} {...p} />)}
    {meshProps[4].map((p, i) => <CompVac key={i} {...p} />)}
   </> 
  );
  */
}

    //<SiaBoxed texture={texture} points={sias} ar={pointsAr} boxProps={boxProps} sa={true} size={2}/>

function DrawCanvas({coords, saviInfo, siavenu, clusters, clustersizes, camerapos, boxsize, setLabel}) {
  const sias = [];
  const vacs = [];
  const infoSia = [];
  const infoVac = [];
  const showInfoOf = (index) => {
      console.log("clicked" + index);
    //setLabel("clicked " +  index);
  }
  const onClickFn = (event) => {
    if (event.intersections.length === 0) return;
    let minDist = event.intersections[0].distanceToRay;
    let minIndex = event.intersections[0].index;
    for (let i = 1; i < event.intersections; i++) {
      if(event.intersections[i].distanceToRay < minDist) {
        minDist = event.intersections[i].distanceToRay;
        minIndex = event.intersections[i].index;
      }
    }
    event.stopPropagation();
    if (minDist < 1.0) return minIndex;
    return -1;
  }

  const onClickFnSia = (event) => {
    const i = onClickFn(event);
    if (i < 0 || i >= sias.length) return;
    setLabel("Sia at " + sias[i].position.join(', '));
  }

  const onClickFnVac = (event) => {
    const i = onClickFn(event);
    if (i < 0 || i >= sias.length) return;
    setLabel("Vacancy at " + sias[i].position.join(', '));
  }

  for (const c of coords) {
    //if (c[4] > 0) continue; // cluster
    if (c[4] != 0) continue; // cluster or triad
    if (c[3] == 1) {
      //nSingleSias++;
      sias.push({position:[c[0], c[1], c[2]], color:[0.5, 0.5, 0.2], opacity:((c[5]===1)?0.9:0.4), onClick:onClickFnSia});
    }
    else {
      //nSingleVacs++;
      vacs.push({position:[c[0], c[1], c[2]], color:[0.8, 0.8, 0.1], opacity:((c[5]==1)?0.9:0.4), onClick:onClickFnVac});
    }
  }
  const onClickFnTriad = (event) => {
      console.log("triad");
      onClickFnSia(event);
  }
  for (const triad of siavenu) {
    const curColor = (triad[0].length === 2) ? [0.5, 0.5, 0.2]  : getPairColorOrient(triad[1]);
    for (const cIndex of triad[0]) {
      const c = coords[cIndex];
      if (c[3] == 1) {
        //nSingleSias++;
        sias.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.9:0.4), onClick:onClickFnTriad});
        //infoSia.push()
      }
      else {
        //nSingleVacs++;
        vacs.push({position:[c[0], c[1], c[2]], color:curColor, opacity:((c[5]==1)?0.9:0.4), onClick:onClickFnTriad});
      }

    }
  }
  //console.log("vacs size", vacs.length);
  // clusters
  const meshProps = [[], [], [], [], []];
  for (const clusterLabel in saviInfo) {
    defectItems(coords, saviInfo[clusterLabel].venu, saviInfo[clusterLabel].samuh, sias, vacs, meshProps, clusterLabel);
  }
  for (const clusterLabel in clusters) {
    if (clustersizes[clusterLabel] > -1) continue;
    vacClusters(coords, clusters[clusterLabel], sias, vacs, meshProps[4], clusterLabel);
  }
  const [texture1, texture2] = useTexture(["textures/metalatom.png", "textures/vacancy.png"])
  const camPos = [camerapos[0], camerapos[1], camerapos[2] - boxsize/1.6];
  const box = new THREE.Box3();
  box.setFromCenterAndSize( new THREE.Vector3(camerapos[0], camerapos[1], camerapos[2]), new THREE.Vector3( boxsize, boxsize, boxsize ) );
  return (
    <Canvas
    linear
    gl={{ antialias: false, alpha: false }}
    camera={{ position: camPos, near: 1, far: 1000 }}
    onCreated={({ gl }) => gl.setClearColor('#fbfbfe')}>
    <ambientLight />
    <pointLight position={[150, 150, 150]} intensity={0.55} />
    <Sia texture={texture1} points={sias} sa={true} size={2}/>
    <Sia texture={texture2} points={vacs} sa={true} size={2}/>
    <DrawClusters meshProps={meshProps}/>
    <box3Helper args={[box, 0x4090a0]}/>
    <axesHelper args={[10]}/>
    <OrbitControls target={camerapos}/>
    </Canvas>

  );
    //
}

export default function SaviCascadeViz(props) {
   const [label, setLabel] = useState("shunyam");
   return (
    <div style={{height:"360px"}} >
    <React.Suspense fallback={null}>
   {props.coords && <DrawCanvas setLabel={setLabel} {...props} />}
    </React.Suspense>
    <p>
      {label}
    </p>
    </div>
   );
}



    //
    /*

    <ambientLight />
    <pointLight position={[150, 150, 150]} intensity={0.55} />
    */
