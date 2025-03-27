require('dotenv').config();

module.exports =
  {
     development: {
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'job_finder_db',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql'
    },
    test: {
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'job_finder_test',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql'
    },
    production: {    // Railway provided
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME, 
      host: process.env.DB_HOST, 
      port: process.env.DB_PORT || 3306, 
      dialect: 'mysql',
      logging: false, 
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
};