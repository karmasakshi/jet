// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const perfectionist = require('eslint-plugin-perfectionist');

const selectorRules = {
  '@angular-eslint/component-selector': [
    'error',
    { type: 'element', prefix: 'jet', style: 'kebab-case' },
  ],
  '@angular-eslint/directive-selector': [
    'error',
    { type: 'attribute', prefix: 'jet', style: 'camelCase' },
  ],
};

const modernAngularRules = {
  '@angular-eslint/prefer-inject': 'error',
  '@angular-eslint/prefer-on-push-component-change-detection': 'error',
  '@angular-eslint/prefer-signals': 'error',
};

const classRules = {
  '@typescript-eslint/explicit-member-accessibility': 'error',
  '@typescript-eslint/member-ordering': [
    'error',
    {
      classes: [
        '#private-instance-field',
        'public-instance-field',
        'constructor',
        'public-instance-method',
        '#private-instance-method',
      ],
    },
  ],
  '@typescript-eslint/prefer-readonly': 'error',
};

const namingRules = {
  '@typescript-eslint/naming-convention': [
    'error',
    { selector: 'default', format: ['camelCase'], leadingUnderscore: 'forbid' },
    {
      selector: 'enumMember',
      format: ['PascalCase'],
      leadingUnderscore: 'forbid',
    },
    {
      selector: 'method',
      modifiers: ['private'],
      format: ['camelCase'],
      leadingUnderscore: 'require',
    },
    {
      selector: 'parameter',
      modifiers: ['unused'],
      format: ['camelCase'],
      leadingUnderscore: 'require',
    },
    {
      selector: 'parameterProperty',
      modifiers: ['private'],
      format: ['camelCase'],
      leadingUnderscore: 'require',
    },
    {
      selector: 'property',
      modifiers: ['private'],
      format: ['camelCase', 'snake_case', 'UPPER_CASE'],
      leadingUnderscore: 'require',
    },
    {
      selector: 'property',
      format: ['camelCase', 'snake_case', 'UPPER_CASE'],
      leadingUnderscore: 'forbid',
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
      leadingUnderscore: 'forbid',
    },
    {
      selector: 'variable',
      modifiers: ['const'],
      types: ['function'],
      format: ['camelCase'],
      leadingUnderscore: 'forbid',
    },
    {
      selector: 'variable',
      modifiers: ['const'],
      format: ['camelCase', 'UPPER_CASE'],
      leadingUnderscore: 'forbid',
    },
  ],
};

const perfectionistRules = {
  'perfectionist/sort-enums': 'warn',
  'perfectionist/sort-interfaces': 'warn',
  'perfectionist/sort-intersection-types': 'warn',
  'perfectionist/sort-objects': 'warn',
  'perfectionist/sort-object-types': 'warn',
  'perfectionist/sort-switch-case': 'warn',
  'perfectionist/sort-union-types': 'warn',
};

const templateRules = {
  '@angular-eslint/template/attributes-order': 'warn',
  '@angular-eslint/template/cyclomatic-complexity': 'off',
  '@angular-eslint/template/i18n': 'off',
  '@angular-eslint/template/no-call-expression': 'off',
  '@angular-eslint/template/no-inline-styles': 'off',
  'no-restricted-syntax': [
    'error',
    { selector: 'BoundAttribute[name="ngClass"]' },
    { selector: 'BoundAttribute[name="ngStyle"]' },
  ],
};

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      ...selectorRules,
      ...modernAngularRules,
      ...classRules,
      ...namingRules,
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "PropertyDefinition[accessibility='private'], MethodDefinition[accessibility='private'], TSParameterProperty[accessibility='private']",
          message: 'Use ECMAScript private (#) instead of TypeScript private.',
        },
      ],
      ...perfectionistRules,
      'no-alert': 'error',
      'no-console': 'error',
      'sort-keys': ['error', 'asc', { caseSensitive: false }],
    },
    languageOptions: { parserOptions: { projectService: true } },
    plugins: { perfectionist },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateAll],
    rules: templateRules,
  },
);
