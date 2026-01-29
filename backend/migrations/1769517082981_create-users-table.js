/* Create users (admin) table for authentication and admin area */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    hashed_password: {
      type: 'varchar(255)',
      notNull: true
    },
    role: {
      type: 'varchar(32)',
      notNull: true,
      default: 'admin'
    },
    is_active: {
      type: 'boolean',
      notNull: true,
      default: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    last_login: {
      type: 'timestamp',
      default: null
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};