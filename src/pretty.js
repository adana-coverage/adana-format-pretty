import chalk from 'chalk';
import path from 'path';
import { tags, metrics } from 'adana-analyze';
import { readFileSync } from 'fs';
import frame from 'babel-code-frame';

const colors = {
  ignored: chalk.dim,
  failed: chalk.red,
  optimal: chalk.green,
};

function missing(entries) {
  return entries.filter(entry => {
    return entry.count === 0;
  });
}

function code(data, { root }) {
  const files = { };
  try {
    Object.keys(data, file => {
      files[file] = readFileSync(path.join(root, file), 'utf8');
    });
    return files;
  } catch (err) {
    return { };
  }
}

function compute(data) {
  const files = Object.keys(data);
  return Array.prototype.concat.apply([], files.map(file => {
    const coverage = data[file];
    const t = tags(coverage.locations);
    return Object.keys(t).map(tag => {
      const { passed, total } = metrics(t[tag]);
      return { tag, passed, total, file };
    });
  }));
}

export default function pretty(data, {
  root = process.cwd(),
} = { }) {
  const entries = compute(data);
  const files = code(data, { root });

  return [
    ...entries.map(({ tag, passed, total }) => {
      return `${tag}: ${colors.optimal(passed)} / ${total}`;
    }),

    ...missing(entries).map(({ loc, file }) => {
      return frame(files[file], loc.start.line, loc.start.column, {
        highlightCode: true,
      });
    }),
  ].join('\n');
}
