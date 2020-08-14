
exports.up = function (knex) {
    return knex.schema.createTable("borrows", function (t) {
        t.increments("id").primary();
        t.string("student_code", 10).notNullable().references("code").inTable("students").onUpdate("CASCADE").onDelete("CASCADE");
        t.timestamp("borrow_date").notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP()'));
        t.timestamp("due_date").notNullable();
        t.timestamp("return_date").nullable().defaultTo(null);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("borrows");
};