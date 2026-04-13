const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

async function seedTestDatabase() {
  console.log('🌱 Iniciando seed do banco TEST...');

  // 🔒 IDs FIXOS — precisam bater com os testes
  const companyId = '11111111-1111-1111-1111-111111111111';
  const userId = '22222222-2222-2222-2222-222222222222';
  const professionalId = '33333333-3333-3333-3333-333333333333';
  const serviceId = '44444444-4444-4444-4444-444444444444';

  // 🔴 Limpeza (ordem importa por causa de FK)
  await pool.query('DELETE FROM appointments');
  await pool.query('DELETE FROM schedule_blocks');
  await pool.query('DELETE FROM professional_services');
  await pool.query('DELETE FROM professionals');
  await pool.query('DELETE FROM services');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM company_business_hours');
  await pool.query('DELETE FROM companies');

  // 🏢 Company
  await pool.query(
    `INSERT INTO companies (
      id,
      name,
      slug,
      appointment_buffer_minutes,
      slot_interval_minutes,
      lunch_start_time,
      lunch_end_time,
      status
   )
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      companyId,
      'Company Test',
      'company-test',
      0,
      30,
      '12:00',  // 👈 almoço início
      '13:00',  // 👈 almoço fim
      'active'
    ]
  );

  // 👤 User (senha = 123456)
  await pool.query(
    `INSERT INTO users (
        id,
        company_id,
        name,
        username,
        password_hash,
        is_company_admin,
        is_active
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userId,
      companyId,
      'Admin Test',
      'admin',
      '$2b$10$pQcTaFSEujIL8x3cH8UwaOcGtjkA4A/udf13TdqhL5n.S65djevYC',
      true,
      true
    ]
  );

  // 👨‍🔧 Professional
  await pool.query(
    `INSERT INTO professionals (
        id,
        company_id,
        user_id,
        slug,
        is_active
     )
     VALUES ($1, $2, $3, $4, $5)`,
    [
      professionalId,
      companyId,
      userId,
      'prof-33333333',
      true
    ]
  );

  // 💇 Service
  await pool.query(
    `INSERT INTO services (
        id,
        company_id,
        name,
        slug,
        base_price,
        duration_minutes,
        is_active
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      serviceId,
      companyId,
      'Service Test',
      'service-test',
      100,
      60,
      true
    ]
  );

  // 🔗 Relacionar profissional ↔ serviço
  await pool.query(
    `INSERT INTO professional_services (
        company_id,
        professional_id,
        service_id
     )
     VALUES ($1, $2, $3)`,
    [
      companyId,
      professionalId,
      serviceId
    ]
  );

  // 🕒 Business Hours (quinta-feira = 4)
  // 2026-04-09 é quinta-feira
  await pool.query(
    `INSERT INTO company_business_hours (
        id,
        company_id,
        weekday,
        start_time,
        end_time,
        is_active
     )
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      uuidv4(),
      companyId,
      4,
      '09:00',
      '18:00',
      true
    ]
  );

  console.log('✅ Seed finalizado com sucesso.');
}

module.exports = {
  seedTestDatabase
};