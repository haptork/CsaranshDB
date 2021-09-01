const devData = require("./cascades-dev.json");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  const data = devData.data;
  let tableRows = [];
  for (let cascade of data) {
    for (let clusterId in cascade.clust_cmp) {
      let pairs = {};
      for (let criterion in cascade.clust_cmp[clusterId]) {
        pairs[''+cascade.id+","+clusterId] = [cascade.id], clusterId];
      }
      for (let criterion in cascade.clust_cmp_size[clusterId]) {
        pairs[''+cascade.id+","+clusterId] = [cascade.id, clusterId];
      }
      let coords = {};
      for (let x in pairs) {
        coords[pairs[x]] = getClusterCoords(data, pairs[x]);
      }
      tableRows.push({
        'cascadeid':cascade.id,
        'clusterName': clusterId,
        'morphology': cascade.clusterClasses[clusterId],
        'size': cascade.id.clusterSizes[clusterId],
        'coords': getClusterCoords(data[cascade.id-1], clusterId),
        'cmp': cascade.clust_cmp[clusterId],
        'cmpsize': cascade.clust_cmp_size[clusterId],
        'cmpcoords': coords
      });
    }
  }
  await knex('clusters').del();

  return knex('clusters').insert();
};
