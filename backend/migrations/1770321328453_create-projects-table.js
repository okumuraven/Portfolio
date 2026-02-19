exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('projects', {
    id: 'id', // Auto PK
    title: { type: 'text', notNull: true },
    description: { type: 'text' },
    category: { type: 'text', notNull: true },  // Could use enum if desired
    skills: { type: 'integer[]', notNull: false },  // references skills(id)
    persona_ids: { type: 'integer[]', notNull: false }, // references personas(id)
    date_start: { type: 'date', notNull: false },
    date_end: { type: 'date', notNull: false },
    demo_link: { type: 'text', notNull: false },
    repo_link: { type: 'text', notNull: false },
    image: { type: 'text', notNull: false },
    highlight: { type: 'text', notNull: false },
    visible: { type: 'boolean', notNull: true, default: true },
    order: { type: 'integer', notNull: false },
    collaborators: { type: 'jsonb', notNull: false }, // Array of {name, role, profile_link}
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('now()') },
  });
  
  // Optional: index for "visible" and "order"
  pgm.createIndex('projects', 'visible');
  pgm.createIndex('projects', 'order');
};

exports.down = (pgm) => {
  pgm.dropTable('projects');
};