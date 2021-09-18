#!/usr/bin/env python
# coding: utf-8
"""
should be run from examples folder as current directory
downloads, processes W cascades of 2keV from cascadesDB
shows some basic plots from the processed data
runs a http server and opens the web-app with processed data loaded
"""

# In[ ]:


import sys
import os
import json
import sqlite3
import pandas as pd
import seaborn as sns
from pandas import DataFrame
pathToCsaranshPP = ".."
sys.path.append(pathToCsaranshPP)
from csaranshpp import getDefaultConfig, writeResultsToJSON
buildDir = os.path.join(pathToCsaranshPP, "_build")
libPath = os.path.join(buildDir, "libcsaransh-pp_shared.so")
if (not os.path.exists(buildDir) or not os.path.exists(libPath)):
    print("Library not found at", libPath)
    print("This might be due to build errors in cmake.")
    print("If built successfully, edit this source and correct build directory & lib file (so / dlib / dll) path.")

from csaranshpp import processXyzFilesInDirGivenMetaFile, _unzipFile
from csaranshpp_ml_cdb import validateForCdb

def stageEkaCpp(metaFilePath, xyzDir, config):
    isSuccess, cascades = processXyzFilesInDirGivenMetaFile(metaFilePath, xyzDir, config)
    return [isSuccess, isSuccess, cascades]

def stageDwiMl(cascades):
  return validateForCdb(cascades)

dbToJsonMap = {
  "id": "id",
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
  'eigencoords': 'eigen_coords',
  'dclustcoords': 'dclust_coords',
  'codefects': 'coDefects',
  'clusters': 'clusters',
  'clusterclasses': 'clusterClasses'
};

dbToJsonMap2 = (
  ("id", "id"),
  ("cascadeid", "id"),
  ('ncell', 'ncell'),
  ('energy', 'energy'),
  ('boxsize', 'boxSize'),
  ('latticeconst', 'latticeConst'),
  ('temperature', 'temperature'),
  ('simulationtime', 'simulationTime'),
  ('infile', 'infile'),
  ('xyzfilepath', "xyzFilePath"),
  ('substrate', 'substrate'),
  ('simulationcode', 'simulationCode'),
  ('potentialused', 'potentialUsed'),
  ('author', 'author'),
  ('es', 'es'),
  ('tags', 'tags'),
  ('ndefects', 'n_defects'),
  ("nclusters", 'n_clusters'),
  ("maxclustersize", 'max_cluster_size'),
  ("maxclustersizei", 'max_cluster_size_I'),
  ("maxclustersizev", 'max_cluster_size_V'),
  ("incluster", 'in_cluster'),
  ("inclusteri", 'in_cluster_I'),
  ("inclusterv", 'in_cluster_V'),
  ("ndclustv", 'dclustI_count'),
  ("dclustsecimpact", 'dclust_sec_impact'),
  ("hullvol", 'hull_vol'),
  ("hulldensity", 'hull_density'),
  ('coords', 'coords'),
  ('eigencoords', 'eigen_coords'),
  ('dclustcoords', 'dclust_coords'),
  ('codefects', 'coDefects'),
  ('clusters', 'clusters'),
  ('clusterclasses', 'clusterClasses')
);

dbTypes = {
  "id": "string",
  "cascadeid": "string",
  'ncell': 'integer',
  'energy': 'integer',
  'boxsize': 'real',
  'latticeconst': 'real',
  'temperature': 'real',
  'simulationtime': 'integer',
  'infile': 'string',
  'xyzfilepath': "string",
  'substrate': 'string',
  'simulationcode': 'string',
  'potentialused': 'string',
  'author': 'string',
  'es': 'integer',
  'tags': 'text',
  'ndefects': 'integer',
  "nclusters": 'integer',
  "maxclustersize": 'integer',
  "maxclustersizei": 'integer',
  "maxclustersizev": 'integer',
  "incluster": 'integer',
  "inclusteri": 'integer',
  "inclusterv": 'integer',
  "ndclustv": 'integer',
  "dclustsecimpact": 'real',
  "hullvol": 'real',
  "hulldensity": 'real',
  'viewfields': 'text',
  'created_at': 'text'
};

def cookCascadesDbTuple(cascades):
  rows = []
  for cascade in cascades:
    row = []
    for val in dbToJsonMap2:
      #if val[0] == "id": continue
      if val[0] == "coords": break
      row.append(cascade[val[1]])
    row.append(json.dumps({
      'coords': cascade['coords'],
      'eigencoords': cascade['eigen_coords'],
      'codefects': cascade['coDefects'],
      'clusters': cascade['clusters'],
      'clusterclasses': cascade['clusterClasses']
    }))
    rows.append(tuple(row))
  columns = []
  for val in dbToJsonMap2:
    #if val[0] == "id": continue
    if val[0] == "coords": 
      columns.append('viewfields')
      break
    columns.append(val[0])
  return (rows, columns)

def addCascadesTable(cascades, cur):
  cur.execute('''create table cascades
               (id text Primary key, cascadeid text unique, ncell integer, energy integer, boxsize real, latticeconst real not null,
                temperature real, simulationtime real, infile string, xyzfilepath string not null,
                substrate sring, simulationcode string, potentialused string, author string,
                es integer, tags text, ndefects integer, nclusters integer,
                maxclustersize integer, maxclustersizei integer, maxclustersizev integer,
                incluster integer, inclusteri integer, inclusterv integer, ndclustv integer,
                dclustsecimpact integer, hullvol real, hulldensity real, viewfields text,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP)''')
  cascadesTuple, columns = cookCascadesDbTuple(cascades)
  if len(cascadesTuple) > 0:
    li = ["?"]*len(cascadesTuple[0])
    qStr = "("+ ",".join(li) + ")"
    #print(cascadesTuple[0])
    cStr = "(" + ",".join(columns) + ")"
    cur.executemany("INSERT INTO cascades" + cStr + " VALUES " + qStr, cascadesTuple);

def getCoordType (row, cid):
  cid = str(cid);
  if len(cid) == 0 or cid not in row['eigen_features']: return -1;
  if 'features' in row and cid in row['features'] and 'lines' in row['features'][cid]: return 1;
  return 0;

def getClusterCoord(row, cid):
  c = [[],[],[]];
  if (len(cid) == 0 or not row or cid not in row['eigen_features']): return c
  for x in row['eigen_features'][cid]['coords']:
    c[0].append(x[0]);
    c[1].append(x[1]);
    c[2].append(x[2]);
  return c

def getClusterLineCoord(row, cid):
  lines = [];
  linesT = [];
  pointsI = [[], [], [], []];
  pointsV = [[], [], [], []];
  cid = str(cid)
  if cid:
    for x in row['features'][cid]['lines']['linesT']:
      c = [[],[],[],[], [-1.0, -1.0]]
      c[4] = x['orient']
      for y in x['main']:
        curCoord = row['coords'][row['clusters'][cid][y]]
        c[0].append(curCoord[0]);
        c[1].append(curCoord[1]);
        c[2].append(curCoord[2]);
        c[3].append(str(x['orient']));
      linesT.append(c);
    for x in row['features'][cid]['lines']['lines']:
      c = [[],[],[],[], [-1.0, -1.0]];
      c2 = [[],[],[],[], [-1.0, -1.0]];
      c[4] = x['orient']
      c2[4] = x['orient']
      for y in x['main']:
        curCoord = row['coords'][row['clusters'][cid][y]]
        c[0].append(curCoord[0]);
        c[1].append(curCoord[1]);
        c[2].append(curCoord[2]);
        c[3].append(str(x['orient']));
      for y in x['sub']:
        curCoord = row['coords'][row['clusters'][cid][y]]
        c2[0].append(curCoord[0]);
        c2[1].append(curCoord[1]);
        c2[2].append(curCoord[2]);
        c2[3].append(str(x['orient']));
      lines.append({'main':c, 'sub':c2});
    for x in row['features'][cid]['lines']['pointsI']:
      curCoord = row['coords'][row['clusters'][cid][x]]
      pointsI[0].append(curCoord[0]);
      pointsI[1].append(curCoord[1]);
      pointsI[2].append(curCoord[2]);
      pointsI[3].append(x);
    for x in row['features'][cid]['lines']['pointsV']:
      curCoord = row['coords'][row['clusters'][cid][x]]
      pointsV[0].append(curCoord[0]);
      pointsV[1].append(curCoord[1]);
      pointsV[2].append(curCoord[2]);
      pointsV[3].append(x);
  return {"lines":lines, "linesT":linesT, "pointsI":pointsI, "pointsV":pointsV};

def cookClustersDbTuple(cascades):
  rows = []
  for cascade in cascades:
    for clusterName in cascade['clusters']:
      row = [cascade['id'], clusterName]
      curClusterClass = cascade['clusterClasses']['savi'][clusterName]
      row.append(cascade['clusterSizes'][clusterName])
      row.append(curClusterClass['morph'])
      coordType = getCoordType(cascade, clusterName);
      coords = getClusterLineCoord(cascade, clusterName) if (coordType == 1) else getClusterCoord(cascade, clusterName);
      row.append(coordType)
      row.append(json.dumps(coords))
      # coords and coordtype
      row.append(curClusterClass['hdbpoint'][0])
      row.append(curClusterClass['hdbpoint'][1])
      rows.append(tuple(row))
  columns = ["cascadeid", "name", "size", "savimorph", "coordtype", "coords", "hdbx", "hdby"]
  return (rows, columns)

def addClustersTable(cascades, cur):
  cur.execute('''create table clusters
               (id integer Primary Key, 
                cascadeid text not null, name integer, savimorph text, size integer, coordtype integer,
                coords text, hdbx real, hdby real, cmp text, cmpsize text, cmppairs text, morphdesc text,
                properties text, created_at DATETIME DEFAUlT CURRENT_TIMESTAMP, 
                foreign key (cascadeid) references cascades (id), unique(cascadeid, name))''')
  clusterTuples, columns = cookClustersDbTuple(cascades)
  if len(clusterTuples) > 0:
    li = ["?"]*len(clusterTuples[0])
    qStr = "("+ ",".join(li) + ")"
    cStr = "(" + ",".join(columns) + ")"
    cur.executemany("INSERT INTO clusters" + cStr + " VALUES " + qStr, clusterTuples);


def writeMlResultsToSqliteDb(cascades, config, isOverwrite=True):
  con = None
  try: 
    con = sqlite3.connect(config['outputDbPath'])
  except sqlite3.Error as e:
    print(e)
    if con: con.close()
    return False
  cur = con.cursor()
  addCascadesTable(cascades, cur)
  addClustersTable(cascades, cur)
  cur.execute("CREATE UNIQUE INDEX 'cascades_xyzfilepath_unique' on 'cascades' ('xyzfilepath')")
  cur.execute("CREATE UNIQUE INDEX 'clusters_cascadeid_name_unique' on 'clusters' ('cascadeid', 'name')")
  con.commit()
  con.close()
  return True

def validateArchive(metaFilePath, extractionDir, archivePath, overwriteJson, overwriteDb):
  archiveName = os.path.basename(archivePath)
  xyzDir = _unzipFile(extractionDir, archivePath, archiveName)
  if len(xyzDir) == 0: return [False, "Error in unzipping the file.", {}]
  config = getDefaultConfig() # check bottom cell for various keys / options to configure
  config['logFilePath'] = os.path.join(xyzDir, "log.txt")
  config['outputJSONFilePath'] = os.path.join(xyzDir, "cascades.json")
  config['outputDbPath'] = os.path.join(xyzDir, "cascades.db")
  config['csaranshLib'] = libPath
  if not(os.path.exists(config['outputJSONFilePath'])) or overwriteJson:
    isSuccess, msg, cascades = stageEkaCpp(metaFilePath, xyzDir, config)
    if not isSuccess: return [isSuccess, msg]
    cascades = stageDwiMl(cascades)
    writeMlResultsToJSON(cascades, config)
  else:
    f = open(config['outputJSONFilePath'], 'r')
    cascades = json.load(f)
    f.close()
  if not(os.path.exists(config['outputDbPath'])) or overwriteDb:
    if os.path.exists(config['outputDbPath']):
      os.remove(config['outputDbPath'])
    writeMlResultsToSqliteDb(cascades, config)
  summarizeLog(config)
  # saved cascades.json, cascades.db, log-summary.md, log.txt
  return [True, ""]

def addToDb(srcDb, destDb):
  pass

def writeMlResultsToJSON(res, config):
    f = open(config['outputJSONFilePath'], "w")
    json.dump(res, f)
    f.close()

def  summarizeLog(config):
    pass

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("please provide metafilepath, extractiondir, archivepath")
    else:
        metaFilePath = sys.argv[1]
        extractionDir = sys.argv[2]
        archivePath = sys.argv[3]
        overwriteJson = False
        overwriteDb = False
        if len(sys.argv) > 4: overwriteJson = (sys.argv[4] == "1")
        if len(sys.argv) > 5: overwriteDb = (sys.argv[5] == "1")
        validateArchive(metaFilePath, extractionDir, archivePath, overwriteJson, overwriteDb)