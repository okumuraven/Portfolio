exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('contact_profile', {
    id: { type: 'serial', primaryKey: true },
    field: { type: 'varchar(64)', notNull: true },   // "real_name", "about_summary", etc.
    value: { type: 'text', notNull: true },          // Your actual data
    type: { type: 'varchar(32)', notNull: true },    // "string", "text", "social_link", ...
    sort_order: { type: 'integer', default: 0 },     // << renamed for SQL safety
    visible: { type: 'boolean', default: true },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()'), notNull: true }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('contact_profile');
};