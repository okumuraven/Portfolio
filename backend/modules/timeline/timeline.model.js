const db = require('../../database');

/**
 * Timeline Model: CRUD and advanced queries for timeline feed/events.
 */
const TimelineModel = {
  async findAll(opts = {}) {
    const filters = [];
    const values = [];
    let idx = 1;

    if (opts.type) {
      filters.push(`type = $${idx++}`);
      values.push(opts.type);
    }
    if (opts.visible !== undefined) {
      filters.push(`visible = $${idx++}`);
      values.push(!!opts.visible);
    }
    if (opts.reviewed !== undefined) {
      filters.push(`reviewed = $${idx++}`);
      values.push(!!opts.reviewed);
    }
    if (opts.automated !== undefined) {
      filters.push(`automated = $${idx++}`);
      values.push(!!opts.automated);
    }
    if (opts.skillId !== undefined) {
      filters.push(`$${idx++} = ANY(skill_ids)`);
      values.push(Number(opts.skillId));
    }
    if (opts.provider) {
      filters.push(`provider = $${idx++}`);
      values.push(opts.provider);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT * FROM timeline
      ${whereClause}
      ORDER BY
        "order" ASC NULLS LAST,
        date_start DESC,
        id DESC
    `;
    return db.any(query, values);
  },

  async findById(id) {
    return db.oneOrNone('SELECT * FROM timeline WHERE id = $1', [id]);
  },

  async create(event) {
    return db.one(`
      INSERT INTO timeline (
        type, title, date_start, date_end, description, skill_ids,
        icon, proof_link,
        source, provider, provider_event_id,
        source_name, source_url,
        visible, automated, reviewed, "order", created_at, updated_at
      ) VALUES (
        $[type], $[title], $[date_start], $[date_end], $[description], $[skill_ids],
        $[icon], $[proof_link],
        $[source], $[provider], $[provider_event_id],
        $[source_name], $[source_url],
        $[visible], $[automated], $[reviewed], $[order], NOW(), NOW()
      )
      RETURNING *
    `, {
      ...event,
      skill_ids: Array.isArray(event.skill_ids) ? event.skill_ids : [],
      source: event.source ?? 'internal',
      source_name: event.source_name ?? null,
      source_url: event.source_url ?? null,
      visible: event.visible !== undefined ? event.visible : true,
      automated: event.automated !== undefined ? event.automated : false,
      reviewed: event.reviewed !== undefined ? event.reviewed : false,
      order: event.order ?? null,
    });
  },

  async update(id, event) {
    return db.one(`
      UPDATE timeline SET
        type = $[type],
        title = $[title],
        date_start = $[date_start],
        date_end = $[date_end],
        description = $[description],
        skill_ids = $[skill_ids],
        icon = $[icon],
        proof_link = $[proof_link],
        source = $[source],
        provider = $[provider],
        provider_event_id = $[provider_event_id],
        source_name = $[source_name],
        source_url = $[source_url],
        visible = $[visible],
        automated = $[automated],
        reviewed = $[reviewed],
        "order" = $[order],
        updated_at = NOW()
      WHERE id = $[id]
      RETURNING *
    `, {
      ...event,
      id,
      skill_ids: Array.isArray(event.skill_ids) ? event.skill_ids : [],
      source: event.source ?? 'internal',
      source_name: event.source_name ?? null,
      source_url: event.source_url ?? null,
      order: event.order ?? null,
    });
  },

  async remove(id) {
    return db.result('DELETE FROM timeline WHERE id = $1', [id]);
  },

  async findByProviderEvent(provider, provider_event_id) {
    return db.oneOrNone(
      'SELECT * FROM timeline WHERE provider = $1 AND provider_event_id = $2',
      [provider, provider_event_id]
    );
  }
};

module.exports = TimelineModel;