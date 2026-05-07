/* eslint-disable no-undef */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('users', {
    two_factor_secret: {
      type: 'varchar(255)',
      default: null,
    },
    two_factor_enabled: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['two_factor_secret', 'two_factor_enabled']);
};
