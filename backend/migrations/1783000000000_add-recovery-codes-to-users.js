/* eslint-disable no-undef */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('users', {
    recovery_codes: {
      type: 'text[]',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['recovery_codes']);
};
