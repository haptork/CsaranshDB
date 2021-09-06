const Router = require('express').Router;
const dbhandle = require("../db/dbhandle");

module.exports = () => {
  const api = Router();
  const dbColumns = {
    "cascadeid": "text",
    "id": "text",
    'energy': 'range',
    'temperature': 'range',
    'simulationtime': 'range',
    'infile': 'text',
    'xyzfilepath': "text",
    'substrate': 'text',
    'potentialused': 'text',
    'author': 'text',
    'es': 'text',
    'tags': 'text',
    'ndefects': 'range',
    "nclusters": 'range',
    "maxclustersize": 'range',
    "maxclustersizei": 'range',
    "maxclustersizev": 'range',
    "incluster": 'range',
    "inclusteri": 'range',
    "inclusterv": 'range',
    "ndclusti": 'range',
    "dclustsecimpact": 'range',
    "hullvol": 'range',
    "hulldensity": 'range',
  }
  /*
  api.get('/', (req, res) => {  
  	res.json({api: true});
  });
  */

  const validateCascade = (cascade) => {
      return [cascade, False];
  };
  
  api.post('/add', async (req, res) => {
    const [cascade, error] = validateCascade(req.body);
    if (error) {
        res.status(400).send(error.details);
    }
    try {
    const ids = await dbhandle("cascades").insert(cascade);
    res.status(201).json(ids);
    } catch (err) {
      res.status(500).json({message:"Error adding cascade.", error: err});
    }
  });
  
  api.get('/cascades', async (req, res) => {
    let rows = dbhandle.from("cascades");
  
    const dlimit = [5, 10000];
    let limit = (req.query.limit == '') ? dlimit[0] : parseInt(req.query.limit);
    if (isNaN(limit)) limit = dlimit[1];
    if (limit > dlimit[1]) limit = dlimit[1];
    rows.limit(limit);
  
    if (req.query.offset && req.query.offset != '') {
      const offsetVal = parseInt(req.query.offset);
      if (!isNaN(offsetVal)) rows.offset(offsetVal);
    }
 
    const sortColumn = req.query.sort;
    if (sortColumn && sortColumn !== '' && sortColumn in dbColumns) {
      if (req.query.desc !== undefined) {
          rows.orderBy(sortColumn, 'desc');
      } else {
          rows.orderBy(sortColumn, 'asc');
      }
    }

    const filters = req.query.filter;
    //console.log(filters)

    for (let column in filters) {
      if (!column in dbColumns) continue;
      if (dbColumns[column] === 'text') {
        rows.where(column, "like", '%'+filters[column]+'%');
      } else if (dbColumns[column] === 'range') {
        if (filters[column].length < 2) continue;
        rows.where(column, ">=", filters[column][0]);
        rows.where(column, "<", filters[column][1]);
      }
    }
    //console.log(rows.toSQL().toNative());
    rows.select("id", "ndefects", "substrate", "energy", "temperature");
    const cascades =  await rows;
    res.send(cascades);
  });
  
  api.get('/cascade/:id', async (req, res) => {
    const id = req.params.id;
    const cascade = await dbhandle.where({id:id}).first().from("cascades");
    if (!cascade) res.status(404).send("<h2> Error getting cascade with input id. </h2>");
    res.send(cascade);
  });

  api.get('/clustercmp/:id/:cid', async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    //console.log(id, cid);
    const cluster = await dbhandle.select("coordtype", "coords", "savimorph", "size", "cmp", "cmpsize", "cmppairs")
                            .where({cascadeid:id, name:cid}).first().from("clusters");
    if (!cluster) {
      res.status(404).send("<h2> Error getting cascade with input id. </h2>");
    }
    const cmpCoords = {};
    const pairs = JSON.parse(cluster.cmppairs);
    for (let cmpClusterStr in pairs) {
      const cmpCluster = cmpClusterStr.split(',');
      const curClusterCoords = await dbhandle.select("coordtype", "coords", "savimorph", "size")
                            .where({cascadeid:cmpCluster[0], name:cmpCluster[1]}).first().from("clusters");
      if (curClusterCoords) cmpCoords[cmpClusterStr] = {...curClusterCoords, ...pairs[cmpClusterStr]};
    }
    cluster.cmppairs = cmpCoords;
    cluster.cmp = JSON.parse(cluster.cmp);
    cluster.cmpsize = JSON.parse(cluster.cmpsize);
    cluster.coords = JSON.parse(cluster.coords);
    res.send(cluster);
  });

  api.get('/clustercoords/:id/:cid', async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    console.log(id, cid);
    const cluster = await dbhandle.select("coordtype", "coords")
                            .where({cascadeid:id, name:cid}).first().from("clusters");
    if (!cluster) res.status(404).send("<h2> Error getting cascade with input id. </h2>");
    console.log(cluster)
    res.send(cluster);
  });
  return api;
}
