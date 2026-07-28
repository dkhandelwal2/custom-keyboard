module.exports = {
  plugins: [
    process.env.TSUP_BUILD && require('postcss-modules')({
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    })
  ].filter(Boolean)
};
