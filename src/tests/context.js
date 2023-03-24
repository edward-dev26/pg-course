const crypto = require("crypto");
const pool = require("../pool");
const {default: migrate} = require("node-pg-migrate");
const usersRepo = require("../repositories/users.repository");

const DB_HOST = 'localhost';
const DB_PORT = 5432;
const DB_NAME = 'social-network-test';

class Context {
    static async build() {
        const roleName = 'test' + crypto.randomBytes(4).toString('hex');

        await Context.connectAsRoot();
        await pool.createRole(roleName);
        await pool.createSchema(roleName);
        await pool.close();

        const roleDbUrl = {
            host: 'localhost',
            port: 5432,
            database: 'social-network-test',
            user: roleName,
            password: roleName,
        };

        await Context.runMigration(roleDbUrl, roleName);
        await pool.connect(roleDbUrl);

        return new Context(roleName);
    }

    static connectAsRoot() {
        return pool.connect({
            host: DB_HOST,
            port: DB_PORT,
            database: DB_NAME,
            username: 'eshvetsov',
            password: '',
        });
    }

    static runMigration(databaseUrl, schema) {
        return migrate({
            schema,
            direction: 'up',
            log() {
            },
            noLock: true,
            dir: 'migrations',
            databaseUrl
        });
    }

    constructor(roleName) {
        this.roleName = roleName;
    }

    async cleanup() {
        await pool.close();
        await Context.connectAsRoot();
        await pool.deleteSchema(this.roleName);
        await pool.deleteRole(this.roleName);
        await pool.close();
    }

    async reset() {
        return usersRepo.deleteAll();
    }
}

module.exports = Context;
