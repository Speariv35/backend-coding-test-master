module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb'],
  plugins: ['babel', 'import', 'prettier', 'jsx-a11y', 'react'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'no-undef': 'warn',
  },
};
