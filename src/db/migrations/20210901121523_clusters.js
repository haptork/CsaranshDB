exports.up = async function(knex, Promise) {
  await knex.schema.createTable('clusters', t => {
      t.increments('id').primary();
      t.text("cascadeid").notNullable().references("id").inTable("cascades").onDelete("CASCADE");
      t.integer('name');
      t.string("savimorph");
      t.integer("size");
      t.integer('coordtype');
      t.text("coords");
      t.float("hdbx");
      t.float("hdby");
      t.text("cmp");
      t.text('cmpsize');
      t.text('cmppairs');
      t.string('morphdesc');
      t.string('properties');
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.unique(['cascadeid', 'name']);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('clusters');
};
