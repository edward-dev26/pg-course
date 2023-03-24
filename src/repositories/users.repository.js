const pool = require('../pool');

class UsersRepository {
    async find() {
        const result = await pool.query(`
            SELECT *
            FROM users;
        `);

        return result.rows.map(this._mapUser);
    }

    async findById(id) {
        const result = await pool.query(`
            SELECT *
            FROM users
            WHERE id = $1;
        `, [id]);

        const user = result.rows[0];

        if (!user) {
            return null;
        }

        return this._mapUser(result.rows[0]);
    }

    async insert(payload) {
        const {username, bio} = payload;
        const result = await pool.query(`
            INSERT INTO users (username, bio)
            VALUES ($1, $2)
            RETURNING *;
        `, [username, bio]);

        const user = result.rows[0];

        return this._mapUser(user);
    }

    async update(id, payload) {
        const {username, bio} = payload;
        const result = await pool.query(`
            UPDATE users
            SET username = $1, bio = $2
            WHERE id = $3
            RETURNING *;
        `, [username, bio, id]);

        const user = result.rows[0];

        if (!user) {
            return null;
        }

        return this._mapUser(user);
    }

    async delete(id) {
        const result = await pool.query(`
            DELETE FROM users
            WHERE id = $1
            RETURNING *;
        `, [id]);

        const user = result.rows[0];

        if (!user) {
            return null;
        }

        return this._mapUser(user);
    }

    async deleteAll() {
        await pool.query(`
            DELETE FROM users;
        `);
    }

    async getCount() {
        const result = await pool.query(`
            SELECT COUNT(*) FROM users;
        `);

        return Number(result.rows[0].count) || 0;
    }

    _mapUser({id, created_at, updated_at, username, bio}) {
        return {
            id,
            username,
            bio,
            createdAt: created_at.toString(),
            updatedAt: updated_at.toString(),
        };
    }
}

module.exports = new UsersRepository();
