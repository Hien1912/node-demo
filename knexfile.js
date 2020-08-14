module.exports = {
    development: {
        client: process.env.DB_CLIENT || "mysql",
        connection: {
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASS || "",
            database: process.env.DB_NAME || "node",
            charset: "utf8"
        },
        migrations: {
            directory: __dirname + '/database/migrations'
        },
        seeds: {
            directory: __dirname + '/database/seeds'
        }
    },
    production: {

    }
}