import fs from 'node:fs';
import path from 'node:path';

const dir = '/Users/hyngridsouza/Downloads/kommo-import-salesbots-final';
const file = 'Salesbot1_BoasVindas.json';
const fullPath = path.join(dir, file);
const backupPath = path.join(dir, `Salesbot1_BoasVindas.before_pet_field_update_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);

const OLD_FIELD = '{{lead.cf.1043022}}';
const NEW_FIELD = '{{lead.cf.1043230}}';

const root = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
let text = root.model.text;
let positions = root.model.positions;

fs.copyFileSync(fullPath, backupPath);

text = text.split(OLD_FIELD).join(NEW_FIELD);
positions = positions.split(OLD_FIELD).join(NEW_FIELD);

root.model.text = text;
root.model.positions = positions;

fs.writeFileSync(fullPath, `${JSON.stringify(root, null, 2)}\n`);

const raw = JSON.stringify(root);
console.log(JSON.stringify({
  backupPath,
  oldFieldStillPresent: raw.includes(OLD_FIELD),
  newFieldPresent: raw.includes(NEW_FIELD),
}, null, 2));
