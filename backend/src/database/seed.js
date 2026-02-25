const pool = require('./db');
const bcrypt = require('bcrypt');

async function seedTestDatabase() {
  console.log('🌱 Iniciando seed do banco TEST...');

  // ⚠️ Ordem importa por causa de FKs
  await pool.query('DELETE FROM appointments');
  await pool.query('DELETE FROM schedule_blocks');
  await pool.query('DELETE FROM services');
  await pool.query('DELETE FROM professionals');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM companies');

  const companyId = '11111111-1111-1111-1111-111111111111';
  const userId = '22222222-2222-2222-2222-222222222222';
  const professionalId = '33333333-3333-3333-3333-333333333333';
  const serviceId = '44444444-4444-4444-4444-444444444444';

  const passwordHash = await bcrypt.hash('123456', 10);

  // Company
  await pool.query(
    `INSERT INTO companies (id, name, appointment_buffer_minutes)
     VALUES ($1, $2, $3)`,
    [companyId, 'Company Test', 0]
  );

  // User Admin
  await pool.query(
    `INSERT INTO users (id, company_id, name, username, password_hash, is_company_admin, is_active)
     VALUES ($1, $2, $3, $4, $5, true, true)`,
    [userId, companyId, 'Admin Test', 'admin', passwordHash]
  );

  // Professional
  await pool.query(
    `INSERT INTO professionals (id, company_id, user_id, is_active)
     VALUES ($1, $2, $3, true)`,
    [professionalId, companyId, userId]
  );

  // Service
  await pool.query(
    `INSERT INTO services (id, company_id, professional_id, name, duration_minutes, price)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [serviceId, companyId, professionalId, 'Service Test', 60, 100]
  );

  console.log('✅ Seed TEST concluído com sucesso.');
}

module.exports = seedTestDatabase;