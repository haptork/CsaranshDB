const knexConfig = require("../../knexfile.js");
const knex = require('knex');

const fn = () => {
  const environment = process.env.NODE_ENV || 'development';
  const selectedConfig = knexConfig[environment];

  const dbhandle = knex(selectedConfig);

  //dbhandle.on('query', console.log)

  return dbhandle;
}

module.exports = fn();
