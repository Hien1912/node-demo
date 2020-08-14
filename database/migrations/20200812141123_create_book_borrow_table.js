
exports.up = function (knex) {
    return knex.schema.createTable("book_borrow", function (t) {
        t.integer("borrow_id").unsigned().references("id").inTable("borrows").onUpdate("CASCADE").onDelete("CASCADE");
        t.string("book_code", 10).references("code").inTable("books").onUpdate("CASCADE").onDelete("CASCADE");
        t.primary(['book_code', "borrow_id"]);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("book_borrow");
};