const Knex = require("knex");

exports.up = function (knex) {
    return knex.schema.createTable("students", function (t) {
        t.increments("id").primary();
        t.string("code", 10).unique().notNullable();
        t.string("name", 50).notNullable();
        t.string("avatar", 225).defaultTo(null);
        t.date("dob").notNullable();
        t.string("class", 10).notNullable();
        t.timestamps(true, true);
        t.timestamp("deleted_at").defaultTo(null);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("students");
};