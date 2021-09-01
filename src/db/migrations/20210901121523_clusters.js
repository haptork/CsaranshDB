exports.up = async function(knex, Promise) {
  await knex.schema.createTable('clusters', t => {
      t.increments('id').primary();
      t.integer("cascadeid").notNullable().references("id").inTable("cascades").onDelete("CASCADE");
      t.integer('clusterName');
      t.string("morphology");
      t.integer("size");
      t.text("coords");
      t.text("cmp");
      t.text('cmpsize');
      t.text('cmpcoords');
      t.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('clusters');
};

/*
 *
xyzFilePath <class 'str'>
id <class 'str'>
substrate <class 'str'>
simulationCode <class 'str'>
energy <class 'int'>
simulationTime <class 'int'>
ncell <class 'int'>
boxSize <class 'float'>
latticeConst <class 'float'>
temperature <class 'int'>
tags <class 'str'>
infile <class 'str'>
potentialUsed <class 'str'>
author <class 'str'>
es <class 'int'>
n_defects <class 'int'>
n_clusters <class 'int'>
max_cluster_size_I <class 'int'>
max_cluster_size_V <class 'int'>
max_cluster_size <class 'int'>
in_cluster_I <class 'int'>
in_cluster_V <class 'int'>
in_cluster <class 'int'>
dclustI_count <class 'int'>
dclust_sec_impact <class 'float'>
hull_vol <class 'float'>
hull_area <class 'float'>
hull_density <class 'float'>
hull_nvertices <class 'int'>
hull_nsimplices <class 'int'>
clust_cmp <class 'dict'>
clust_cmp_size <class 'dict'>
clusterClasses <class 'dict'>

coords <class 'list'>
coDefects <class 'list'>
hull_vertices <class 'list'>
hull_simplices <class 'list'>

origin <class 'list'>
rectheta <class 'int'>
recphi <class 'int'>
xrec <class 'int'>
yrec <class 'int'>
zrec <class 'int'>
isPkaGiven <class 'int'>
originType <class 'int'>
error <class 'str'>
clusters <class 'dict'>
clusterSizes <class 'dict'>
features <class 'dict'>
eigen_coords <class 'list'>
eigen_pka <class 'list'>
eigen_var <class 'list'>
eigen_features <class 'dict'>
dclust_coords <class 'dict'>
anglesI <class 'list'>
anglesV <class 'list'>
distancesI <class 'list'>
distancesV <class 'list'>
*/

