/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const up = (pgm) => {
  pgm.createTable('chatbot_config', {
    id: { type: 'serial', primaryKey: true },
    is_active: { type: 'boolean', notNull: true, default: false },
    base_website_price: { type: 'varchar(100)', notNull: false },
    hourly_rate: { type: 'varchar(100)', notNull: false },
    system_prompt: { type: 'text', notNull: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  // Insert a default config row so we don't have to worry about rows missing
  pgm.sql(`
    INSERT INTO chatbot_config (is_active, base_website_price, hourly_rate, system_prompt)
    VALUES (false, '500', '50', 'You are a professional, helpful pricing assistant. Use the base prices to estimate costs.');
  `);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
const down = (pgm) => {
  pgm.dropTable('chatbot_config');
};

module.exports = { shorthands, up, down };
