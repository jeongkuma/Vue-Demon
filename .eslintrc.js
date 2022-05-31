module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // Prettier 문제로 인해, 함수 옆 공백을 체크하는 부분 해제 (기본은 공백을 넣는 것으로 한다.)
    'space-before-function-paren':'off'
  },
  globals:{
    '$': false,
    '_': false,
    'tui': false,
    'axios': false
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
