const Knex = require('knex');

module.exports = Knex({
    client: process.env.DB_CLIENT || "mysql",
    connection: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "node",
        dateStrings: "DATE"
    }
});