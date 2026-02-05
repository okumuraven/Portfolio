/**
 * Groups skills by category.
 * @param {Array} skills
 * @returns {Object} { [category]: [skills]}
 */
export function groupSkillsByCategory(skills = []) {
  return skills.reduce((acc, skill) => {
    const cat = skill.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
}

/**
 * Sorts skills (defaults to order -> years -> name)
 * @param {Array} skills
 */
export function sortSkills(skills = []) {
  return [...skills].sort((a, b) => {
    // Priority: order ASC, years DESC, name ASC
    if ((a.order ?? 999) !== (b.order ?? 999)) return (a.order ?? 999) - (b.order ?? 999);
    if ((b.years ?? 0) !== (a.years ?? 0)) return (b.years ?? 0) - (a.years ?? 0);
    return (a.name || '').localeCompare(b.name || '');
  });
}

/**
 * Filters superpower (key/featured) skills
 * @param {Array} skills
 */
export function getSuperpowerSkills(skills = []) {
  return skills.filter(skill => !!skill.superpower);
}

/**
 * Searches skills by name or description (case-insensitive)
 * @param {Array} skills
 * @param {String} query
 */
export function searchSkills(skills = [], query = '') {
  if (!query) return skills;
  const q = query.toLowerCase();
  return skills.filter(
    skill => (skill.name && skill.name.toLowerCase().includes(q)) ||
             (skill.description && skill.description.toLowerCase().includes(q))
  );
}