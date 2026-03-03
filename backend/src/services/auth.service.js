const bcrypt = require('bcrypt');
const { findByUsername, findByUsernameAndCompany } = require('../database/users.repository');

async function authenticate(username, password) {
  const user = await findByUsername(username);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  if (!user.is_active) {
    throw new Error('User inactive');
  }

  return user;
}

async function authenticateWithCompany(username, password, companyId) {
  const user = await findByUsernameAndCompany(username, companyId);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  if (!user.is_active) {
    throw new Error('User inactive');
  }

  return user;
}

module.exports = {
  authenticate,
  authenticateWithCompany
};