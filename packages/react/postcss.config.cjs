// Inlines every @import (tokens + per-component CSS) into one stylesheet and
// autoprefixes it. The result — dist/strake.css — is what consumers import as
// `@codysue/strake/styles.css`.
module.exports = {
  plugins: [require('postcss-import'), require('autoprefixer')],
};
