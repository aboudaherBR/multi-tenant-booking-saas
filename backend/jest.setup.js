process.env.NODE_ENV = 'test';

const seedTestDatabase = require('./src/database/seed');

beforeAll(async () => {
  await seedTestDatabase();
});