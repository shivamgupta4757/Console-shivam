import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HERO_DATA,
  ABOUT_DATA,
  PROJECTS_DATA,
  ACHIEVEMENTS_DATA,
  SKILLS_DATA,
  COMMAND_ITEMS,
  filterCommands,
  filterSkillsByCategory,
  computeOrbitalPosition,
  dampValue,
  stepWeightedDamping,
  generateDotMatrixWord,
} from './portfolioData';

test('Hero and About data match verified user specifications', () => {
  assert.equal(HERO_DATA.topLabel, 'CONSOLE SHIVAM / PORTFOLIO 2026');
  assert.deepEqual(HERO_DATA.headlineLines, ['BUILDING', 'BEYOND', 'THE ORDINARY.']);
  assert.ok(ABOUT_DATA.institution.includes('IES University, Bhopal'));
  assert.equal(ABOUT_DATA.duration, '2023–2027');
});

test('All 4 actual projects are present without fake statistics', () => {
  const titles = PROJECTS_DATA.map((p) => p.title);
  assert.deepEqual(titles, ['LocalGo', 'ShopPilot AI', 'MusicX', 'Console Shivam']);
});

test('All 6 verified achievements and community roles are present', () => {
  assert.equal(ACHIEVEMENTS_DATA.length, 6);
  const titles = ACHIEVEMENTS_DATA.map((a) => a.title);
  assert.ok(titles.includes('Hacktoberfest 2025'));
  assert.ok(titles.includes('Social Winter of Code 2025'));
  assert.ok(titles.includes('Social Summer of Code 2025'));
  assert.ok(titles.includes('GSSoC 2026'));
  assert.ok(titles.includes('HackerRank Campus Crew'));
  assert.ok(titles.includes('ECSoC 2026'));
});

test('All 15 required skills are present without fake percentage bars', () => {
  const expectedSkills = [
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'MySQL',
    'Git',
    'GitHub',
    'Postman',
    'Figma',
    'Tailwind CSS',
  ];
  const actualNames = SKILLS_DATA.map((s) => s.name);
  for (const skill of expectedSkills) {
    assert.ok(actualNames.includes(skill), `Missing skill: ${skill}`);
  }
  assert.equal(SKILLS_DATA.length, 15);
  assert.equal(filterSkillsByCategory(SKILLS_DATA, 'Backend & Data').length, 4);
});

test('3D orbital math, exponential damping, dot-matrix generator, and command palette filter work deterministically', () => {
  const pos = computeOrbitalPosition(10, 100, 6, 2);
  assert.ok(Number.isFinite(pos.x) && Number.isFinite(pos.y) && Number.isFinite(pos.z));

  const damped = dampValue(0, 10, 5, 0.1);
  assert.ok(damped > 0 && damped < 10);

  const step1 = stepWeightedDamping(0, 1, 0, 5.5, 18.0, 0.016);
  const step2 = stepWeightedDamping(step1.value, 1, step1.velocity, 5.5, 18.0, 0.016);
  assert.ok(step1.value > 0 && step1.value < 1);
  assert.ok(step2.value > step1.value);
  assert.ok(step2.velocity > step1.velocity, 'Velocity should build smoothly from rest for weighted feel');

  const glyphs = generateDotMatrixWord('SHIVAM');
  assert.equal(glyphs.length, 6);
  assert.equal(glyphs[0].grid.length, 5);

  const filteredBroad = filterCommands(COMMAND_ITEMS, 'ShopPilot');
  assert.equal(filteredBroad.length, 2);

  const filteredExact = filterCommands(COMMAND_ITEMS, 'shoppilot-ai');
  assert.equal(filteredExact.length, 1);
  assert.equal(filteredExact[0].target, 'shoppilot-ai');
});
