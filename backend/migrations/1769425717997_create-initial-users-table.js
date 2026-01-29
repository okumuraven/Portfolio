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
  // (You can add columns or migration logic here if needed.)
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 * @param {Function} run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // (Put undo logic here.)
};