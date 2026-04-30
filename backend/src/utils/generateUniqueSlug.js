const { findCompanyBySlug } = require('../database/companies.repository');

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await findCompanyBySlug(slug);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

module.exports = generateUniqueSlug;