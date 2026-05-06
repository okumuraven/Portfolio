/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable('recovery_briefings', {
    id: { type: 'serial', primaryKey: true },
    content: { type: 'text', notNull: true },
    type: { type: 'varchar(50)', notNull: true, default: 'DAILY_TWEET' },
    sent_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable('recovery_briefings');
};
