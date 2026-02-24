/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

// Not using shorthands—define explicit types for clarity.
const shorthands = undefined;

/**
 * Create the timeline table: stores events for public timeline, milestones, Home stats, admin, and integrations.
 *
 * - Fields cover all professional use cases: internal/external, links, review, persona/skill linkage, proof, and future integrations.
 */
const up = (pgm) => {
  pgm.createTable('timeline', {
    id: { type: 'serial', primaryKey: true },

    // Core fields
    type: { type: 'varchar(32)', notNull: true },     // e.g. work, certification, project, award, education, etc.
    title: { type: 'varchar(256)', notNull: true },
    date_start: { type: 'date', notNull: true },
    date_end: { type: 'date', default: null },
    description: { type: 'text', default: null },

    // Links to other modules/entities
    persona_id: { type: 'integer', references: 'personas(id)', onDelete: 'SET NULL' },
    skill_ids: { type: 'integer[]', default: '{}' },

    icon: { type: 'varchar(255)', default: null },        // Icon url/name for fast UI rendering
    proof_link: { type: 'varchar(1024)', default: null }, // Credential/media/proof

    // Source/integration fields
    source: { type: 'varchar(32)', notNull: true, default: 'internal' }, // internal/external
    provider: { type: 'varchar(64)', default: null },      // (if external)
    provider_event_id: { type: 'varchar(128)', default: null }, // unique external id for dedup

    visible: { type: 'boolean', notNull: true, default: true },
    automated: { type: 'boolean', notNull: true, default: false },
    reviewed: { type: 'boolean', notNull: true, default: false },

    order: { type: 'integer', default: null },             // Manual ordering override (optional)
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  // Indexes for query speed and future scaling
  pgm.createIndex('timeline', ['type', 'visible', 'persona_id']);
  pgm.createIndex('timeline', ['date_start', 'date_end']);
};

/**
 * Drop the timeline table if rolling back.
 */
const down = (pgm) => {
  pgm.dropTable('timeline');
};

module.exports = { shorthands, up, down };