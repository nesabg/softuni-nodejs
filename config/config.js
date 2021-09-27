module.exports = {
  development: {
    port: process.env.PORT,
    dbUri: process.env.DB_URI,
    secretKey: process.env.SECRET
  },
  production: {}
}
