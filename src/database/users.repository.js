const { connect } = require('./db');

async function findByUsername(username) {
  const pool = await connect();

  const result = await pool.query(
    `
      SELECT id,
             name,
             username,
             password_hash,
             company_id,
             is_company_admin,
             is_professional,
             is_active
      FROM users
      WHERE username = $1
      LIMIT 1
    `,
    [username]
  );

  return result.rows[0] || null;
}

module.exports = {
  findByUsername
};
