import fs from 'fs';
import path from 'path';

const keywords = JSON.parse(
  fs.readFileSync(path.resolve('src/config/keywords.json'), 'utf-8')
);

export function matchKeyword(content) {
  return keywords.find(keyword => content.includes(keyword));
}
