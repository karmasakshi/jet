import { type Config } from 'prettier';

export default {
  cssDeclarationSorterOrder: 'alphabetical',
  objectWrap: 'collapse',
  overrides: [
    { files: '*.html', options: { parser: 'angular' } },
    {
      files: ['*.sql'],
      options: {
        parser: 'postgresql',
        sqlFunctionCase: 'lower',
        sqlIdentifierCase: 'lower',
        sqlKeywordCase: 'lower',
        sqlLiteralCase: 'lower',
        sqlTypeCase: 'lower',
      },
    },
  ],
  plugins: [
    'prettier-plugin-css-order',
    'prettier-plugin-organize-imports',
    'prettier-plugin-sql-cst',
  ],
  printWidth: 100,
  singleAttributePerLine: true,
  singleQuote: true,
} satisfies Config;
