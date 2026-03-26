/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const up = (pgm) => {
  pgm.createTable('chat_logs', {
    id: { type: 'serial', primaryKey: true },
    ip_address: { type: 'varchar(45)', notNull: false },
    user_message: { type: 'text', notNull: true },
    ai_response: { type: 'text', notNull: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const down = (pgm) => {
  pgm.dropTable('chat_logs');
};

module.exports = { shorthands, up, down };
