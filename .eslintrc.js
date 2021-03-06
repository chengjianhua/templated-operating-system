module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    // 'plugin:css-modules/recommended'
  ],
  plugins: [
    'css-modules'
  ],
  globals: {
    __DEV__: true
  },
  env: {
    browser: true,
    mocha: true
  },
   settings: {
    'import/resolver': {
      'babel-module': {}
    }
  },
  rules: {
    'no-plusplus': 'off',

    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',

    'react/jsx-filename-extension': 'off',
    'react/prefer-stateless-function': 'off',
    'react/forbid-prop-types': 'off',
    'react/sort-comp': 'off',
  }
};
