/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
const shorthands = undefined;

const up = (pgm) => {
  pgm.createTable('timeline', {
    id: { type: 'serial', primaryKey: true },

    type: { type: 'varchar(32)', notNull: true },
    title: { type: 'varchar(256)', notNull: true },
    date_start: { type: 'date', notNull: true },
    date_end: { type: 'date', default: null },
    description: { type: 'text', default: null },

    persona_id: { type: 'integer', references: 'personas(id)', onDelete: 'SET NULL' },
    skill_ids: { type: 'integer[]', default: '{}' },

    icon: { type: 'varchar(255)', default: null },
    proof_link: { type: 'varchar(1024)', default: null },

    source: { type: 'varchar(32)', notNull: true, default: 'internal' },
    provider: { type: 'varchar(64)', default: null },
    provider_event_id: { type: 'varchar(128)', default: null },
    source_name: { type: 'varchar(128)', default: null }, // e.g. "LinkedIn", "GitHub"
    source_url: { type: 'varchar(1024)', default: null }, // original source/event link

    visible: { type: 'boolean', notNull: true, default: true },
    automated: { type: 'boolean', notNull: true, default: false },
    reviewed: { type: 'boolean', notNull: true, default: false },

    order: { type: 'integer', default: null },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createIndex('timeline', ['type', 'visible', 'persona_id']);
  pgm.createIndex('timeline', ['date_start', 'date_end']);
};

const down = (pgm) => {
  pgm.dropTable('timeline');
};

module.exports = { shorthands, up, down };