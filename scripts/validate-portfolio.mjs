import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const projects = JSON.parse(read('data/portfolio-projects.json'));
const caseStudies = JSON.parse(read('data/case-studies.json'));
const settings = JSON.parse(read('data/site-settings.json'));
const cms = read('.pages.yml');

assert.match(index, /<title>[^<]+<\/title>/, 'Homepage must have a title');
assert.match(index, /name="description"/, 'Homepage must include a meta description');
assert.match(index, /rel="canonical"/, 'Homepage must include a canonical URL');
assert.match(index, /id="portfolioProjectGrid"/, 'Project grid mount must exist');
assert.match(index, /id="caseStudyGrid"/, 'Case-study grid mount must exist');
assert.match(index, /class="contact-form"/, 'Contact form must exist');
assert.match(index, /name="_honey"/, 'Contact form honeypot must exist');
assert.match(index, /name="_captcha"/, 'Contact form CAPTCHA configuration must exist');
assert.match(cms, /data\/portfolio-projects\.json/, 'CMS must manage projects');
assert.match(cms, /data\/case-studies\.json/, 'CMS must manage case studies');
assert.match(cms, /data\/site-settings\.json/, 'CMS must manage site settings');

for (const [name, items] of [['projects', projects], ['case studies', caseStudies]]) {
  assert.ok(Array.isArray(items), `${name} must be an array`);
  assert.ok(items.length > 0, `${name} must contain at least one item`);
  const ids = new Set();
  for (const item of items) {
    assert.ok(item.id && item.title && item.description ? true : item.id && item.title && item.summary,
      `${name} items need an ID, title and summary/description`);
    assert.ok(!ids.has(item.id), `${name} IDs must be unique: ${item.id}`);
    ids.add(item.id);
    if (item.link) assert.ok(/^https:\/\/|^(?!\/\/)[a-z0-9._/-]+/i.test(item.link), `Unsafe URL in ${name}: ${item.id}`);
    if (item.image) {
      const imagePath = item.image.replace(/^\//, '');
      if (!/^https:\/\//i.test(imagePath)) assert.ok(fs.existsSync(path.join(root, imagePath)), `Missing image: ${item.image}`);
    }
  }
}
assert.ok(settings.title && settings.description && settings.contactEmail, 'Site settings need title, SEO description and contact email');

// Syntax-check every inline JavaScript block without executing browser code.
const inlineScripts = [...index.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attributes, body]) => !/\bsrc\s*=/.test(attributes) && body.trim());
assert.ok(inlineScripts.length > 0, 'Expected at least one inline JavaScript block');
inlineScripts.forEach(([, , body], index) => new vm.Script(body, { filename: `index-inline-${index + 1}.js` }));

console.log(`Portfolio validation passed: ${projects.length} projects, ${caseStudies.length} case studies, CMS configuration and inline JavaScript syntax.`);
