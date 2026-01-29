/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 * @param {Function} run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Implement your table-create logic here, for example:
  // pgm.createTable('users', {
  //   id: 'id',
  //   email: { type: 'varchar(255)', notNull: true, unique: true },
  //   hashed_password: { type: 'varchar(255)', notNull: true },
  //   role: { type: 'varchar(32)', notNull: true, default: 'admin' },
  //   is_active: { type: 'boolean', notNull: true, default: true },
  //   created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  //   last_login: { type: 'timestamp', default: null }
  // });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 * @param {Function} run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // For rollback, e.g.:
  // pgm.dropTable('users');
};