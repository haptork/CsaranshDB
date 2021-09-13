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
import pickle
import numba
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics.cluster import adjusted_rand_score
from sklearn.metrics.cluster import adjusted_mutual_info_score
from sklearn.neighbors import NearestNeighbors

pathToCsaranshPP = ".."
sys.path.append(pathToCsaranshPP)
from csaranshpp import getDefaultConfig, writeResultsToJSON
buildDir = os.path.join(pathToCsaranshPP, "_build")
libPath = os.path.join(buildDir, "libcsaransh-pp_shared.so")
if (not os.path.exists(buildDir) or not os.path.exists(libPath)):
    print("Library not found at", libPath)
    print("This might be due to build errors in cmake.")
    print("If built successfully, edit this source and correct build directory & lib file (so / dlib / dll) path.")

def dist(a, b):
    res = 0.0
    for x, y in zip(a, b):
        if (abs(x) > 1e-6):
            res += ((x - y)**2 * 1.0) / (1.0*x)
    return round(res, 4)

"""
Helper distance function for dimensionality reduction
"""
@numba.njit()
def chiSqr(x, y, startA, startB, endA, endB):  # brat_curtis
    numerator = 0.0
    denominator = 0.0
    for i, j in zip(range(startA, endA), range(startB, endB)):
        numerator += np.abs(x[i] - y[j])
        denominator += np.abs(x[i] + y[j])

    if denominator > 0.0:
        return float(numerator) / denominator
    else:
        return 0.0



"""
Distance function for dimensionality reduction
"""
@numba.njit()
def quad(x, y):
    l = x.shape[0]
    a = chiSqr(x, y, 0, 0, 36, 36)
    d = chiSqr(x, y, 36, 36, l, l)
    preA = chiSqr(x, y, 0, 1, 35, 36)
    postA = chiSqr(x, y, 1, 0, 36, 35)
    preD = chiSqr(x, y, 36, 37, l - 1, l)
    postD = chiSqr(x, y, 37, 36, l, l - 1)
    wA = 1.2
    wD = 0.9
    wAs = 0.4
    wDs = 0.25
    cA = (wAs * (preA + postA) + a) * wA / (2.0 * wAs + 1.0)
    cD = (wDs * (preD + postD) + d) * wD / (2.0 * wDs + 1.0)
    return (cA + cD) / (wA + wD)

def clusterClassData(data):
    feat = []
    tag = []
    for i, x in enumerate(data):
        for y in x['features']:
            feat.append(x['features'][y]['angle'] + x['features'][y]['dist'])
            tag.append((i, y))
    return (feat, tag)


def quadCustom(wA, wD):
    def quad(x, y):
        l = x.shape[0]
        a = chiSqr(x, y, 0, 0, 36, 36)
        d = chiSqr(x, y, 36, 36, l, l)
        preA = chiSqr(x, y, 0, 1, 35, 36)
        postA = chiSqr(x, y, 1, 0, 36, 35)
        preD = chiSqr(x, y, 36, 37, l - 1, l)
        postD = chiSqr(x, y, 37, 36, l, l - 1)
        wAs = 0.4
        wDs = 0.25
        cA = (wAs * (preA + postA) + a) * wA / (2.0 * wAs + 1.0)
        cD = (wDs * (preD + postD) + d) * wD / (2.0 * wDs + 1.0)
        return (cA + cD) / (wA + wD)
    return quad



def createNN(data, oldNN, feat, tag):
  topsize = 5
  feat, tag = clusterClassData(data)
  neigh = {}
  keys = ['angle', 'dist', 'all']
  quadAngle = quadCustom(1.0, 0.0)
  quadDist = quadCustom(0.0, 1.0)
  quadBoth = quad
  defaultK = topsize * 3 if topsize * 3 < len(feat) else len(feat) - 1
  neigh[keys[0]] = NearestNeighbors(defaultK, metric=quadAngle)
  neigh[keys[1]] = NearestNeighbors(defaultK, metric=quadDist)
  neigh[keys[2]] = NearestNeighbors(defaultK, metric=quadBoth)
  dists = {}
  neighbours = {}
  for key in neigh:
    if len(feat) == 0: continue
    neigh[key].fit(oldNN['nn1'].data+feat)
    dists[key], neighbours[key] = neigh[key].kneighbors()
  allTags = oldNN['tag1'] + tag
  for index, (cascadeIndex, cid) in enumerate(allTags):
    # if new nearest is from new then update else let it be
    # add new ones with it.
    # new dimensionality reduction :|
    if not 'clust_cmp' in cascade:
        cascade['clust_cmp'] = {}
        cascade['clust_cmp_size'] = {}
        cascade['clust_cmp'][cid] = {}
        cascade['clust_cmp_size'][cid] = {}
    elif not cid in cascade['clust_cmp']:
        cascade['clust_cmp'][cid] = {}
        cascade['clust_cmp_size'][cid] = {}
    for key in neigh:
        if key not in dists:
          cascade['clust_cmp'][cid][key] = []
          cascade['clust_cmp_size'][cid][key] = []
        cascade['clust_cmp'][cid][key] = [(x, tag[y][0], tag[y][1]) for x, y in zip(
            dists[key][index][:topsize], neighbours[key][index][:topsize])]
        curLen = len(cascade['clusters'][cid])
        lenDiff = [(abs(curLen - len(data[tag[x][0]]['clusters'][tag[x][1]])), i)
                   for i, x in enumerate(neighbours[key][index])]
        lenDiff.sort()
        cascade['clust_cmp_size'][cid][key] = [
            (dists[key][index][x[1]], tag[neighbours[key][index][x[1]]][0], tag[neighbours[key][index][x[1]]][1]) for x in lenDiff[:topsize]]


def addClusterCmp(data):
    topsize = 5
    feat, tag = clusterClassData(data)
    neigh = {}
    keys = ['angle', 'dist', 'all']
    quadAngle = quadCustom(1.0, 0.0)
    quadDist = quadCustom(0.0, 1.0)
    quadBoth = quad
    defaultK = topsize * 3 if topsize * 3 < len(feat) else len(feat) - 1
    neigh[keys[0]] = NearestNeighbors(defaultK, metric=quadAngle)
    neigh[keys[1]] = NearestNeighbors(defaultK, metric=quadDist)
    neigh[keys[2]] = NearestNeighbors(defaultK, metric=quadBoth)
    dists = {}
    neighbours = {}
    for key in neigh:
        if len(feat) == 0: continue
        neigh[key].fit(feat)
        dists[key], neighbours[key] = neigh[key].kneighbors()
    for index, (cascadeIndex, cid) in enumerate(tag):
        cascade = data[cascadeIndex]
        if not 'clust_cmp' in cascade:
            cascade['clust_cmp'] = {}
            cascade['clust_cmp_size'] = {}
            cascade['clust_cmp'][cid] = {}
            cascade['clust_cmp_size'][cid] = {}
        elif not cid in cascade['clust_cmp']:
            cascade['clust_cmp'][cid] = {}
            cascade['clust_cmp_size'][cid] = {}
        for key in neigh:
            if key not in dists:
              cascade['clust_cmp'][cid][key] = []
              cascade['clust_cmp_size'][cid][key] = []
            cascade['clust_cmp'][cid][key] = [(x, tag[y][0], tag[y][1]) for x, y in zip(
                dists[key][index][:topsize], neighbours[key][index][:topsize])]
            curLen = len(cascade['clusters'][cid])
            lenDiff = [(abs(curLen - len(data[tag[x][0]]['clusters'][tag[x][1]])), i)
                       for i, x in enumerate(neighbours[key][index])]
            lenDiff.sort()
            cascade['clust_cmp_size'][cid][key] = [
                (dists[key][index][x[1]], tag[neighbours[key][index][x[1]]][0], tag[neighbours[key][index][x[1]]][1]) for x in lenDiff[:topsize]]


def mergeCascadeDbs(db1Path, db2Path, nnPath):
  nnDi = {"nn1":None, "nn2":None, "tag1":[], "tag2":[]}
  if (os.path.exists(nnPath)):
    nnFile = open(nnPath, 'r')
    nnDi = pickle.load(nnFile)
    nnFile.close()
  if not nnDi['nn1']:
    pass # TODO


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("please provide metafilepath, extractiondir, archivepath")
    else:
        db1 = sys.argv[1]
        db2 = sys.argv[2]
        nn = sys.argv[3]
        mergeCascadeDbs(db1, db2, nn)