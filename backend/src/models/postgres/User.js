const { createPgPool } = require('../../config/database');

const UserModel = {
  async findAll() {
    const pool = createPgPool();
    try {
      const result = await pool.query(
        'SELECT id, nome, email, role, created_at, updated_at FROM users ORDER BY id ASC'
      );
      return result.rows;
    } catch (error) {
      if (error.code === '42703') { // column does not exist
        const result = await pool.query(
          'SELECT id, nome, email, created_at, updated_at FROM users ORDER BY id ASC'
        );
        return result.rows;
      }
      throw error;
    }
  },

  async findById(id) {
    const pool = createPgPool();
    try {
      const result = await pool.query(
        'SELECT id, nome, email, role, created_at, updated_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '42703') { // column does not exist
        const result = await pool.query(
          'SELECT id, nome, email, created_at, updated_at FROM users WHERE id = $1',
          [id]
        );
        return result.rows[0] || null;
      }
      throw error;
    }
  },

  async findByEmail(email) {
    const pool = createPgPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async create({ nome, email, senha, role = 'user' }) {
    const pool = createPgPool();
    try {
      const result = await pool.query(
        `INSERT INTO users (nome, email, senha, role) VALUES ($1, $2, $3, $4)
         RETURNING id, nome, email, role, created_at, updated_at`,
        [nome, email, senha, role]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '42703') { // column does not exist
        const result = await pool.query(
          `INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3)
           RETURNING id, nome, email, created_at, updated_at`,
          [nome, email, senha]
        );
        return result.rows[0];
      }
      throw error;
    }
  },

  async update(id, { nome, email, senha }) {
    const pool = createPgPool();
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (nome !== undefined) {
      fields.push(`nome = $${paramIndex++}`);
      values.push(nome);
    }
    if (email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (senha !== undefined) {
      fields.push(`senha = $${paramIndex++}`);
      values.push(senha);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, nome, email, created_at, updated_at`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    const pool = createPgPool();
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  },

  async count() {
    const pool = createPgPool();
    const result = await pool.query('SELECT COUNT(*)::int AS total FROM users');
    return result.rows[0].total;
  },
};

module.exports = UserModel;
