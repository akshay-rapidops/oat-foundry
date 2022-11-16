module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript',
    'plugin:import/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'react/static-property-placement':'off',
    'react/no-unused-state': 'off',
    'no-return-await': 'off',
    'react/jsx-filename-extension': 0,
    'no-unused-expressions': 'off',
    'jsx-props-no-spreading': 0,
  },
};

