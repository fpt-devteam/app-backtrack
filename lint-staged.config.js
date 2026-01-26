module.exports = {
  '**/*.{ts,tsx}': (filenames) => {
    return [
      `eslint --fix ${filenames.map((f) => `"${f}"`).join(' ')}`,
      'tsc --noEmit',
    ];
  },
};