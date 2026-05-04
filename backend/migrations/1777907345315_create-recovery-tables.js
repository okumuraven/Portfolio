/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const up = (pgm) => {
  // 1. Recovery Config (One row for the current streak)
  pgm.createTable('recovery_config', {
    id: { type: 'serial', primaryKey: true },
    last_reset_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  // 2. Recovery Logs (Urges, Resets, Milestones)
  pgm.createTable('recovery_logs', {
    id: { type: 'serial', primaryKey: true },
    type: { type: 'varchar(20)', notNull: true }, // 'URGE', 'RESET', 'MILESTONE'
    intensity: { type: 'integer', notNull: false }, // 1-10
    trigger_context: { type: 'text', notNull: false },
    notes: { type: 'text', notNull: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  // 3. Recovery Reasons (Personal reasons for quitting)
  pgm.createTable('recovery_reasons', {
    id: { type: 'serial', primaryKey: true },
    content: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  // Insert initial config
  pgm.sql('INSERT INTO recovery_config (last_reset_at) VALUES (NOW())');
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const down = (pgm) => {
  pgm.dropTable('recovery_reasons');
  pgm.dropTable('recovery_logs');
  pgm.dropTable('recovery_config');
};

module.exports = { shorthands, up, down };
