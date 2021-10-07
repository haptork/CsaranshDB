// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/db/dev.csaransh.db'
    },
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/dev'
    },
    useNullAsDefault: true
  },
  staging: {
    client: 'sqlite3',
    connection: {
      filename: './src/db/staging.csaransh.db'
    },
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/stage'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './src/db/staging.csaransh.db'
    },
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/prod'
    },
    useNullAsDefault: true
  }
};
