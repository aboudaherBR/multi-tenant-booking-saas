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

async function findByUsernameAndCompany(
  username,
  companyId,
  client = pool
) {
  const result = await client.query(
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

async function createUser(
  {
    companyId,
    name,
    username,
    passwordHash,
    isCompanyAdmin
  },
  client = pool
) {
  const result = await client.query(
    `
    INSERT INTO users (
      company_id,
      name,
      username,
      password_hash,
      is_company_admin
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
      id,
      name,
      username,
      company_id,
      is_company_admin
    `,
    [companyId, name, username, passwordHash, isCompanyAdmin]
  );

  return result.rows[0];
}

module.exports = {
  findByUsername,
  findByUsernameAndCompany,
  createUser
};