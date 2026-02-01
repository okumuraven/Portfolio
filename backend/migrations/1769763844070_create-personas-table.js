/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const up = (pgm) => {
  pgm.createTable('personas', {
    id: { type: 'serial', primaryKey: true },
    title: { type: 'varchar(100)', notNull: true },
    type: { type: 'varchar(20)', notNull: true },           // 'current', 'past', 'goal'
    period: { type: 'varchar(50)', notNull: false },
    summary: { type: 'varchar(255)', notNull: false },
    description: { type: 'text', notNull: false },
    motivation: { type: 'varchar(255)', notNull: false },
    icon: { type: 'varchar(255)', notNull: false },
    accent_color: { type: 'varchar(15)', notNull: false },   // HEX color like '#4f8ef7'
    cta: { type: 'varchar(255)', notNull: false },           // persona-specific call-to-action
    is_active: { type: 'boolean', notNull: true, default: false },
    availability: { type: 'varchar(20)', notNull: true, default: 'open' }, // 'open', 'consulting', 'closed'
    order: { type: 'integer', notNull: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const down = (pgm) => {
  pgm.dropTable('personas');
};

module.exports = { shorthands, up, down };