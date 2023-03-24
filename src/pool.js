const pg = require('pg');
const format = require('pg-format');

class Pool {
    _pool = null;

    connect(options) {
        this._pool = new pg.Pool(options);

        return this.validate();
    }

    close() {
        this._pool.end();
    }

    query(sql, params) {
        return this._pool.query(sql, params);
    }

    createRole(name) {
        const sql = format(`
            CREATE ROLE %I WITH LOGIN PASSWORD %L;
        `, name, name);

        return this.query(sql);
    }

    deleteRole(name) {
        const sql = format(`
            DROP ROLE %I;
        `, name);

        return this.query(sql);
    }

    createSchema(name) {
        const sql = format(`
            CREATE SCHEMA %I AUTHORIZATION %I;
        `, name, name);

        return this.query(sql);
    }

    deleteSchema(name) {
        const sql = format(`
            DROP SCHEMA %I CASCADE;
        `, name);

        return this.query(sql);
    }

    validate() {
        return this._pool.query(this.getValidateQuery());
    }

    getValidateQuery() {
        return `SELECT 1 + 1 AS result`;
    }
}

module.exports = new Pool();
