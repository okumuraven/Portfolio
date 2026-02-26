const PersonasModel = require('./personas.model');
const TimelineService = require('../timeline/timeline.service'); // <-- Use TimelineService, not TimelineModel

/**
 * Persona Service – Handles business logic for persona management (and timeline event sync).
 */
const PersonasService = {
  async listAll(opts = {}) {
    return PersonasModel.findAll(opts);
  },

  async getOne(id) {
    return PersonasModel.findById(id);
  },

  /**
   * Create a persona (admin only)
   * If persona is set to active, all others are auto-deactivated.
   * Also create a timeline event for this persona!
   */
  async createPersona(data) {
    if (data.is_active) await PersonasModel.deactivateAll();
    const persona = await PersonasModel.create(data);

    // Timeline event sync (create new)
    try {
      // Use timeline.service to assure all required fields are correct
      await TimelineService.create({
        type: 'persona',
        title: persona.title,
        description: persona.summary || persona.description || '',
        date_start: extractStartDate(persona.period),
        date_end: null, // Always supply date_end for DB compatibility
        icon: persona.icon,
        proof_link: getPublicProofLink(persona), // Only valid public link
        provider: 'internal',
        provider_event_id: `persona-${persona.id}`,
        visible: true,
        automated: true,
        reviewed: true,
        order: persona.order,
        source: 'internal',
        // Optionally: Add profile_link here if your timeline schema supports it:
        // profile_link: `/personas/${persona.id}`
      });
    } catch (err) {
      console.warn('Timeline sync (create) failed:', err.message, err.stack);
    }

    return persona;
  },

  async updatePersona(id, data) {
    if (data.is_active) await PersonasModel.deactivateAll();
    const updatedPersona = await PersonasModel.update(id, data);

    // Timeline event sync (update if exists)
    try {
      const event = await TimelineService.findByProviderEvent('internal', `persona-${id}`);
      if (event) {
        await TimelineService.update(event.id, {
          title: updatedPersona.title,
          description: updatedPersona.summary || updatedPersona.description || '',
          date_start: extractStartDate(updatedPersona.period),
          date_end: null,
          icon: updatedPersona.icon,
          proof_link: getPublicProofLink(updatedPersona),
          order: updatedPersona.order,
          // Optionally: profile_link: `/personas/${id}`
        });
      }
    } catch (err) {
      console.warn('Timeline sync (update) failed:', err.message, err.stack);
    }

    return updatedPersona;
  },

  async deletePersona(id) {
    await PersonasModel.remove(id);

    // Timeline event sync (delete if exists)
    try {
      const event = await TimelineService.findByProviderEvent('internal', `persona-${id}`);
      if (event) {
        await TimelineService.remove(event.id); // or soft-hide for audit/history
      }
    } catch (err) {
      console.warn('Timeline sync (delete) failed:', err.message, err.stack);
    }
  },

  async setActivePersona(id) {
    return PersonasModel.setActive(id);
  }
};

/**
 * Helper function: extract YYYY-MM-DD date from persona.period
 */
function extractStartDate(period) {
  if (!period) return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  if (/^\d{4}-\d{2}$/.test(period)) return `${period}-01`;
  if (/^\d{4}$/.test(period)) return `${period}-01-01`;
  return new Date(period).toISOString().slice(0, 10);
}

/**
 * Ensure only valid public URLs are set for proof_link.
 * Adjust for your data model: If persona has external provenance, use that;
 * otherwise, return null (don't link to admin/internal pages).
 */
function getPublicProofLink(persona) {
  if (
    persona.external_certificate_url &&
    persona.external_certificate_url.startsWith('http')
  ) return persona.external_certificate_url;
  // If you don't have a valid external URL, return null
  return null;
}

module.exports = PersonasService;