/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const up = (pgm) => {
  pgm.createTable('skills', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(100)', notNull: true },           // Skill name
    category: { type: 'varchar(50)', notNull: true },        // "Frontend", "Backend", etc.
    level: { type: 'varchar(30)', notNull: true },           // "Expert", "Intermediate", etc.
    years: { type: 'integer', default: 0 },
    active: { type: 'boolean', default: true },
    superpower: { type: 'boolean', default: false },
    persona_ids: { type: 'integer[]', default: '{}' },       // Link to persona(s)
    icon: { type: 'varchar(255)', default: null },
    cert_link: { type: 'varchar(255)', default: null },
    project_links: { type: 'varchar(255)[]', default: '{}' },// Array of related project URLs/id
    order: { type: 'integer', notNull: false, default: null },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const down = (pgm) => {
  pgm.dropTable('skills');
};

module.exports = { shorthands, up, down };