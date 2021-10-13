const Router = require('express').Router;
const dbhandle = require("../db/dbhandle");
const knex = require('knex');
const path = require('path');

module.exports = () => {
  const api = Router();
  const dbColumns = {
    "cascadeid": "text",
    "id": "text",
    'energy': 'range',
    'temperature': 'range',
    'simulationtime': 'range',
    'infile': 'text',
    'structure': "text",
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
    "ndclustv": 'range',
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

  api.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", 'build', 'index.html'));
  });
  
  api.post(['/add', '/csaransh/add'], async (req, res) => {
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
  
  api.get(['/cascades', '/csaransh/cascades'], async (req, res) => {
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
        if (filters[column].length == 0) continue;
        rows.where(column, ">=", filters[column][0]);
        if (filters[column].length < 2) continue;
        rows.where(column, "<=", filters[column][1]);
      }
    }
    //console.log(rows.toSQL().toNative());
    let query1 = rows.clone();
    let query2 = rows.clone();
    let query3 = rows.clone();
    let query4 = rows.clone();
    //console.log(rows.toSQL().toNative());
    query1.select(dbhandle.raw("DISTINCT substrate"));
    query2.select(dbhandle.raw("DISTINCT energy"));
    query3.select(dbhandle.raw("DISTINCT potentialused"));
    query4.select(dbhandle.raw("DISTINCT temperature"));
    
    //"energy", "temperature", "maxclustersize", "maxclustersizei", "maxclustersizev", "inclusteri", "inclusterv", "hullvol", "hulldensity", "potentialused", "es", "author");
    let out = {};
    out.substrate =  await query1;
    out.energy =  await query2;
    out.potentialused =  await query3;
    out.temperature =  await query4;
    outline = {}
    for(const label in out) {
      outline[label] = [];
      for (const row of out[label]) {
        outline[label].push(row[label])
      }
    }
    rows.select("id", "ndefects", "substrate", "energy", "infile", "xyzfilepath", "temperature", "structure", "maxclustersize", "maxclustersizei", "maxclustersizev", "nclusters", "incluster", "inclusteri", "inclusterv", "hullvol", "hulldensity", "ndclustv", "dclustsecimpact", "potentialused", "es", "author");
    const cascades =  await rows;
    //console.log(cascades[0])
    res.send({'data':cascades, 'outline':outline});
  });
  
  api.get(['/cascade/:id', '/csaransh/cascade/:id'], async (req, res) => {
    const id = req.params.id;
    const cascade = await dbhandle.where({id:id}).first().from("cascades");
    if (!cascade) res.status(404).send("<h2> Error getting cascade with input id. </h2>");
    res.send(cascade);
  });

  api.get(['/clustercmp/:id/:cid', '/csaransh/clustercmp/:id/:cid'], async (req, res) => {
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
      curClusterCoords.coords = JSON.parse(curClusterCoords.coords);
      if (curClusterCoords) cmpCoords[cmpClusterStr] = {...curClusterCoords, ...pairs[cmpClusterStr]};
    }
    cluster.cmppairs = cmpCoords;
    cluster.cmp = JSON.parse(cluster.cmp);
    cluster.cmpsize = JSON.parse(cluster.cmpsize);
    cluster.coords = JSON.parse(cluster.coords);
    res.send(cluster);
  });

  api.get(['/clustercoords/:id/', '/csaransh/clustercoords/:id/'], async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    //console.log(id, cid);
    let rows = dbhandle.from("clusters");
    rows.join('cascades', 'clusters.cascadeid', '=', 'cascades.id')
    rows.select("cascades.id", "cascades.substrate",
      "cascades.energy", "cascades.temperature", "cascades.potentialused",
      "cascades.es", "cascades.author", "clusters.coordtype", "clusters.coords", "clusters.savimorph", "clusters.size", "clusters.name");
    const cluster = await rows.where({"clusters.id":id}).first();
    if (!cluster) res.status(404).send("<h2> Error getting cascade with input id. </h2>");
    cluster.coords = JSON.parse(cluster.coords);
    //console.log(cluster)
    res.send(cluster);
  });
/*
  api.get(['/clustershdb', 'csaransh/clustershdb'], async (req, res) => {
    let rows = dbhandle.from("clusters");
    rows.join('cascades', 'clusters.cascadeid', '=', 'cascades.id')
    const filters = req.query.filter;
    for (let column in filters) {
      if (!column in dbColumns) continue;
      if (dbColumns[column] === 'text') {
        rows.where("cascades."+column, "like", '%'+filters[column]+'%');
      } else if (dbColumns[column] === 'range') {
        if (filters[column].length < 2) continue;
        rows.where("cascades."+column, ">=", filters[column][0]);
        rows.where("cascades."+column, "<", filters[column][1]);
      }
    }
    rows.select("clusters.id", "savimorph", "hdbpoint");
    const clusters = await rows;
    res.send(clusters);
  });
  */
/*
  api.get('/clustershdb', async (req, res) => {
    let rows = dbhandle.from("clusters");
    rows.join('cascades', 'clusters.cascadeid', '=', 'cascades.id')
    const filters = req.query.filter;
    for (let column in filters) {
      if (!column in dbColumns) continue;
      if (dbColumns[column] === 'text') {
        rows.where("cascades."+column, "like", '%'+filters[column]+'%');
      } else if (dbColumns[column] === 'range') {
        if (filters[column].length < 2) continue;
        rows.where("cascades."+column, ">=", filters[column][0]);
        rows.where("cascades."+column, "<", filters[column][1]);
      }
    }
    rows.select("clusters.id", "savimorph", "hdbpoint");
    const clusters = await rows;
    let ditraces = {};
    let traces = [];
    for (let cluster of clusters) {
      if (!(cluster.savimorph in ditraces)) {
        ditraces[cluster.savimorph] = traces.length;
        traces.push({
          x: [],
          y: [],
          id: [],
          name: cluster.savimorph
        });
      }
      const item = traces[ditraces[cluster.savimorph]];
      //console.log(cluster.savimorph, ditraces, traces.length);
      const xy = cluster.hdbpoint.split(",");
      item.x.push(parseFloat(xy[0]));
      item.y.push(parseFloat(xy[1]));
      item.id.push(cluster.id);
    }
    //const li = [];
   // 
   // {id:[], x:[], y:[], savimorph:[]};
   // for (let row of clusters) {
   //   if (!row.savimorph in li) li.savimorph = {};
   //     li.id.push(row.id);
   //     li.savimorph.push(row.savimorph);
   //     const xy = row.hdbpoint.split(",");
   //     li.x.push(parseFloat(xy[0]));
   //     li.y.push(parseFloat(xy[1]));
   // }
    res.send({ditraces, traces});
  });
*/

  api.get(['/clustershdb', '/csaransh/clustershdb'], async (req, res) => {
    let rows = dbhandle.from("clusters");
    rows.join('cascades', 'clusters.cascadeid', '=', 'cascades.id')
    const filters = req.query.filter;
    for (let column in filters) {
      if (!column in dbColumns) continue;
      if (dbColumns[column] === 'text') {
        rows.where("cascades."+column, "like", '%'+filters[column]+'%');
      } else if (dbColumns[column] === 'range') {
        if (filters[column].length < 2) continue;
        rows.where("cascades."+column, ">=", filters[column][0]);
        rows.where("cascades."+column, "<", filters[column][1]);
      }
    }
    //rows.select("clusters.id", "savimorph", "hdbpoint");
    rows.where("savimorph", "!=", "7-?")
    rows.groupBy("savimorph");
    rows.select("savimorph as name", dbhandle.raw("GROUP_CONCAT(clusters.id) as id"), dbhandle.raw("GROUP_CONCAT(hdbx) as x"), dbhandle.raw("GROUP_CONCAT(hdby) as y"));
    let traces = await rows;
    let ditraces = {};
    let i = 0;
    for (let trace of traces) {
      trace.id = trace.id.split(",");
      trace.x = trace.x.split(",");
      trace.y = trace.y.split(",");
      ditraces[trace.name] = i++;
    }
    res.send({ditraces, traces});
  });

  api.get(['/morphstats', '/csaransh/morphstats'], async (req, res) => {
    let rows = dbhandle.from("clusters");
    rows.join('cascades', 'clusters.cascadeid', '=', 'cascades.id')
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
    rows.where("savimorph", "!=", "7-?")
    const groupStr = req.query.groupby;
    //console.log(groupStr);
    const groupColumns = (groupStr) ? groupStr.split(",") : [];
    //console.log(groupColumns);
    const validColumns = new Set(["energy", "substrate", "potentialused", "author", "temperature", "es"]);
    rows.groupBy("savimorph");
    for (let column of groupColumns) {
      console.log(column, (validColumns.has(column)));
      if (!(validColumns.has(column))) continue;
      console.log(column);
      rows.groupBy(column);
      rows.select(column);
    }
    rows.select("savimorph as name", dbhandle.raw("COUNT(DISTINCT(clusters.cascadeid)) as ncascades"), dbhandle.raw("TOTAL(size) as npoints"), dbhandle.raw("COUNT(*) as nclusters"), dbhandle.raw("GROUP_CONCAT(size) as sizeLi"))
    let rowsres =  await rows;
    for (let row of rowsres) {
      row.sizeLi= row.sizeLi.split(",");
      if (row.name === "v") {
        row.npoints = -row.npoints;
        for (let j = 0; j < row.sizeLi.length; j++) { //} in row.sizeLi) {
          row.sizeLi[j] = -parseInt(row.sizeLi[j]);
        }
      }
    }
    res.send(rowsres);
  });
  return api;
}
