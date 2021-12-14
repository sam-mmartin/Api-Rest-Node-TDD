module.exports = {
  test: {
    client: 'pg',
    version: '14.1',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'lord0101',
      database: 'financial',
    },
    migrations: {
      directory: 'src/migrations',
    },
  },
};
