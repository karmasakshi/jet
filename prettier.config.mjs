export default {
  printWidth: 100,
  singleQuote: true,
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
  cssDeclarationSorterOrder: 'alphabetical',
  objectWrap: 'collapse',
  plugins: [
    'prettier-plugin-css-order',
    'prettier-plugin-organize-imports',
    'prettier-plugin-sql-cst',
  ],
  singleAttributePerLine: true,
};
