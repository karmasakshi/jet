// @ts-check
const eslint = require('@eslint/js');
const { defineConfig, globalIgnores } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const perfectionist = require('eslint-plugin-perfectionist');

module.exports = defineConfig([
  globalIgnores([
    './src/env.d.ts',
    './src/main.server.ts',
    './src/main.ts',
    './src/app/svgs',
    './src/app/types/supabase/database.type.ts',
    './supabase',
    './transloco.config.ts',
  ]),
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylisticTypeChecked,
      angular.configs.tsAll,
      perfectionist.configs['recommended-alphabetical'],
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-max-inline-declarations': 'off',
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'jet', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'jet', style: 'camelCase' },
      ],
      '@angular-eslint/sort-keys-in-type-decorator': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: [
              '#private-instance-field',
              'public-instance-field',
              'protected-instance-field',
              'constructor',
              'public-instance-method',
              'protected-instance-method',
              '#private-instance-method',
            ],
          },
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'forbid' },
        { selector: 'enumMember', format: ['PascalCase'], leadingUnderscore: 'forbid' },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'forbid' },
        {
          selector: 'parameter',
          format: ['camelCase'],
          modifiers: ['unused'],
          leadingUnderscore: 'require',
        },
        { selector: 'property', format: ['camelCase', 'snake_case'], leadingUnderscore: 'forbid' },
        { selector: 'typeLike', format: ['PascalCase'], leadingUnderscore: 'forbid' },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'forbid',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: true, ignoreProperties: true },
      ],
      'no-alert': 'error',
      'no-console': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "AccessorProperty[accessibility='private'], MethodDefinition[accessibility='private'], PropertyDefinition[accessibility='private'], TSParameterProperty[accessibility='private']",
          message: 'Use ES Private (#) instead of TS Private (private).',
        },
      ],
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-imports': 'off',
    },
    languageOptions: { parserOptions: { projectService: true } },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateAll],
    rules: {
      '@angular-eslint/template/attributes-order': ['warn', { alphabetical: true }],
      '@angular-eslint/template/cyclomatic-complexity': 'off',
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/no-inline-styles': 'off',
    },
  },
]);
