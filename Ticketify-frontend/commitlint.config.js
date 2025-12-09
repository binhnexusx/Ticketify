export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'style', 'docs', 'update', 'remove', 'chore'],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};
