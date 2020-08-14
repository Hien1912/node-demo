
exports.up = function (knex) {
    return knex.schema.createTable("books", function (t) {
        t.increments("id").primary();
        t.string("code", 10).unique().notNullable();
        t.string("title", 191).notNullable();
        t.string("author_name", 100).notNullable();
        t.integer("total_pages").notNullable();
        t.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("books");
};