
exports.up = function (knex) {
    return knex.schema.createTable("borrows", function (t) {
        t.increments("id").primary();
        t.string("student_code", 10).notNullable().references("code").inTable("students").onUpdate("CASCADE").onDelete("CASCADE");
        t.timestamp("borrowed_at").notNullable().defaultTo(knex.raw('now()'));
        t.date("due_date").notNullable();
        t.timestamp("returned_at").nullable().defaultTo(null);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("borrows");
};