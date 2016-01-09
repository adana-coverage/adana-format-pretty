import { expect } from 'chai';
import path from 'path';
import { readFileSync } from 'fs';
import pretty from '../../src/pretty';

const fixture = path.join(__dirname, '/../fixture/coverage.json');
const data = JSON.parse(readFileSync(fixture, 'utf8'));

it('should output valid string', () => {
  expect((pretty(data))).to.be.a.string;
});
