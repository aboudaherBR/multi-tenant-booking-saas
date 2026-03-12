const pool = require('./db');

async function findByUsername(username) {
  const result = await pool.query(
    `
      SELECT id,
             name,
             username,
             password_hash,
             company_id,
             is_company_admin,
             is_active
      FROM users
      WHERE username = $1
      LIMIT 1
    `,
    [username]
  );

  return result.rows[0] || null;
}


async function findByUsernameAndCompany(username, companyId) {
  const result = await pool.query(
    `
      SELECT id,
             name,
             username,
             password_hash,
             company_id,
             is_company_admin,
             is_active
      FROM users
      WHERE username = $1
        AND company_id = $2
      LIMIT 1
    `,
    [username, companyId]
  );

  return result.rows[0] || null;
}

async function createUser({
  companyId,
  name,
  username,
  passwordHash
}) {

  const result = await pool.query(
    `
    INSERT INTO users (
      company_id,
      name,
      username,
      password_hash,
      is_company_admin
    )
    VALUES ($1, $2, $3, $4, false)
    RETURNING id
    `,
    [companyId, name, username, passwordHash]
  );

  return result.rows[0];
}



module.exports = {
  findByUsername,
  findByUsernameAndCompany,
  createUser
};