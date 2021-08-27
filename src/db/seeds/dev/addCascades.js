const devData = require("./cascades-dev.json");

const changeFieldCaseForDb = (name) =>  {
  return name.toLowerCase().replaceAll('_','');
};

const dbToJsonMap = {
  "cascadeid": "id",
  'ncell': 'ncell',
  'energy': 'energy',
  'boxsize': 'boxSize',
  'latticeconst': 'latticeConst',
  'temperature': 'temperature',
  'simulationtime': 'simulationTime',
  'infile': 'infile',
  'xyzfilepath': "xyzFilePath",
  'substrate': 'substrate',
  'simulationcode': 'simulationCode',
  'potentialused': 'potentialUsed',
  'author': 'author',
  'es': 'es',
  'tags': 'tags',
  'ndefects': 'n_defects',
  "nclusters": 'n_clusters',
  "maxclustersize": 'max_cluster_size',
  "maxclustersizei": 'max_cluster_size_I',
  "maxclustersizev": 'max_cluster_size_V',
  "incluster": 'in_cluster',
  "inclusteri": 'in_cluster_I',
  "inclusterv": 'in_cluster_V',
  "ndclusti": 'dclustI_count',
  "dclustsecimpact": 'dclust_sec_impact',
  "hullvol": 'hull_vol',
  "hulldensity": 'hull_density',
  'coords': 'coords',
  'codefects': 'coDefects',
  'clusters': 'clusters',
  'clusterclasses': 'clusterClasses'
  //'clustercmp': 'clusterCmp',
  //'clustercmpsize': 'clusterCmpSize'
};

const makeFilteredJson = (row, dbCols) => {
  let res = {};
  for (let dbCol of dbCols) {
    if (dbCol != 'viewfields') {
      jsonCol = dbToJsonMap[dbCol];
      if (jsonCol === undefined) continue;
      res[dbCol] = row[jsonCol];
    } else {
      res[dbCol] = JSON.stringify(makeFilteredJson(row, ['coords', 'codefects', 'clusters', 'clusterclasses']));
    }
    //res[dbCol] = makeFilteredJson(row, ['coords', 'codefects', 'clusters', 'clusterclasses', 'clustercmp', 'clustercmpsize']);
  }
  return res;
};

/*
    cascadeid : (row) => row['id'],
    ndclusti : (row) => row['dclustI_count'],
    viewfields : (row) => makeFilteredJson(row, ['coords', 'coDefects', 'clusters', 'clusterClasses', 'clusterCmp', 'clusterCmpSize'])
};
const getDbField = (key) {
  const dbkey = changeFieldCaseForDb(key);
  const val = exceptionMaps[key];
  if (val === undefined) return key;
  return val
};
*/

exports.seed = async function(knex, Promise) {
  const tableColumnObj = await knex('cascades').columnInfo();
  const tableColumns = Object.keys(tableColumnObj);
  //console.log(tableColumns);
  //console.log(devData);
  let tableRows = [];
  const data = devData.data;
  for (let cascade of data) {
    tableRows.push(makeFilteredJson(cascade, tableColumns));
  }
  console.log(tableRows[0]);
  await knex('cascades').del();
  await knex('cascades').insert(tableRows);
  /*
  return knex('cascades').del()
    .then(function () {
      // Inserts seed entries
      return knex('cascades').insert(tableRows);
    });
    */
};
