const devData = require("./cascades-dev.json");

const getClusterCoord = (row, cid) => {
  let c = [[],[],[]];
  if (cid.length == 0 || row == undefined || !row.eigen_features.hasOwnProperty(cid)) return c;
  for (const x of row.eigen_features[cid].coords) {
    c[0].push(x[0]);
    c[1].push(x[1]);
    c[2].push(x[2]);
  }
  return c;
};

const getClusterLineCoord = (row, cid) => {
  let lines = [];
  let linesT = [];
  let pointsI = [[], [], [], []];
  let pointsV = [[], [], [], []];
  cid = "" + cid;
  if (cid.length == 0) cid = undefined;//getInitialSelection(row); // TODO
  //console.log(row.features[cid]['lines'])
  if (cid) {
    //let iCount = 0
    for (const x of row.features[cid]['lines']['linesT']) {
      //console.log(cid);
      let c = [[],[],[],[], [-1.0, -1.0]];
      c[4] = x['orient']
      for (const y of x['main']) {
        //console.log(y);
        //console.log(row.eigen_features[cid]['coords']);
        // const curCoord = row.eigen_features[cid]['coords'][y]
        const curCoord = row.coords[row.clusters[cid][y]]
        c[0].push(curCoord[0]);
        c[1].push(curCoord[1]);
        c[2].push(curCoord[2]);
        //c[3].push(y);
        c[3].push(''+x['orient']);
      }
      /*
      if (iCount < row.features[cid]['lines']['cLinesT'].length)
        c[4] = row.features[cid]['lines']['cLinesT'][iCount++];
        */
      linesT.push(c);
    }
    for (const x of row.features[cid]['lines']['lines']) {
      let c = [[],[],[],[], [-1.0, -1.0]];
      let c2 = [[],[],[],[], [-1.0, -1.0]];
      c[4] = x['orient']
      c2[4] = x['orient']
      for (const y of x['main']) {
        //console.log(y);
        //console.log(row.eigen_features[cid]['coords']);
        // const curCoord = row.eigen_features[cid]['coords'][y]
        const curCoord = row.coords[row.clusters[cid][y]]
        c[0].push(curCoord[0]);
        c[1].push(curCoord[1]);
        c[2].push(curCoord[2]);
        //c[3].push(y);
        c[3].push(''+x['orient']);
      }
      for (const y of x['sub']) {
        //console.log(y);
        //console.log(row.eigen_features[cid]['coords']]);
        // const curCoord = row.eigen_features[cid]['coords'][y]
        const curCoord = row.coords[row.clusters[cid][y]]
        c2[0].push(curCoord[0]);
        c2[1].push(curCoord[1]);
        c2[2].push(curCoord[2]);
        //c2[3].push(y);
        c2[3].push(''+x['orient']);
      }
      lines.push({main:c, sub:c2});
    }
    for (const x of row.features[cid]['lines']['pointsI']) {
      // const curCoord = row.eigen_features[cid]['coords'][x]
      const curCoord = row.coords[row.clusters[cid][x]]
      pointsI[0].push(curCoord[0]);
      pointsI[1].push(curCoord[1]);
      pointsI[2].push(curCoord[2]);
      pointsI[3].push(x);
    }
    for (const x of row.features[cid]['lines']['pointsV']) {
      // const curCoord = row.eigen_features[cid]['coords'][x]
      const curCoord = row.coords[row.clusters[cid][x]]
      pointsV[0].push(curCoord[0]);
      pointsV[1].push(curCoord[1]);
      pointsV[2].push(curCoord[2]);
      pointsV[3].push(x);
    }
  }
  return {lines, linesT, pointsI, pointsV};
};

const getCoordType = (row, cid) => {
  cid = "" + cid;
  if (cid.length == 0 || row == undefined || !row.eigen_features.hasOwnProperty(cid)) return -1;
  if (row.hasOwnProperty('features') &&
      row.features.hasOwnProperty(cid) &&
      row.features[cid].hasOwnProperty('lines')) return 1;
  return 0;
};

const getComparisonPairs = (cascade, clusterId) => {
  let pairs = {};
  for (let key in cascade.clust_cmp[clusterId]) {
    const ar = cascade.clust_cmp[clusterId][key];
    for (let val of ar) {
      pairs[''+val[1]+","+val[2]] = [val[1], val[2]];
    }
  }
  for (let key in cascade.clust_cmp_size[clusterId]) {
    const ar = cascade.clust_cmp[clusterId][key];
    for (let val of ar) {
      pairs[''+val[1]+","+val[2]] = [val[1], val[2]];
    }
  }
  let res = [];
  for (const key in pairs) {
    res.push(pairs[key]);
  }
  return res;
};

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const data = devData.data;
  let tableRows = [];
  for (let cascade of data) {
    for (let clusterId in cascade.clust_cmp) {
      const pairs = getComparisonPairs(cascade, clusterId);
      const coordType = getCoordType(cascade, clusterId);
      const coords = (coordType == 1) ?
                getClusterLineCoord(cascade, clusterId):
                getClusterCoord(cascade, clusterId);
      const size = cascade.clusterSizes[clusterId];
      const morphology = (size < 0) ? 'v' : cascade.clusterClasses.savi[clusterId];
      tableRows.push({
        'cascadeid':cascade.id,
        'name': clusterId,
        'size': size,
        'savimorph': morphology,
        'coordtype': coordType,
        'coords': JSON.stringify(coords),
        'cmp': JSON.stringify(cascade.clust_cmp[clusterId]),
        'cmpsize': JSON.stringify(cascade.clust_cmp_size[clusterId]),
        'cmppairs': JSON.stringify(pairs),
        'morphdesc': '',
        'properties': '',
      });
    }
  }
  await knex('clusters').del();
  return knex('clusters').insert(tableRows);
};
