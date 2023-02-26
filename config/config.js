require('dotenv').config();

module.exports = {
  development: {
    port: 8090 || +process.env.RDS_PORT,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME,
    host: process.env.RDS_HOSTNAME,
    dialect: 'mysql'
  },
  test: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME,
    host: process.env.RDS_HOSTNAME,
    dialect: 'mysql'
  },
  production: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME,
    host: process.env.RDS_HOSTNAME,
    dialect: 'mysql'
  }
}
