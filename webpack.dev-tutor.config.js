const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

// Create base config
const config = createConfig('webpack-dev', {
  resolve: {
    alias: {
      CourseAuthoring: path.resolve(__dirname, 'src/'),
    },
    fallback: {
      fs: false,
      constants: false,
    },
  },
});

// Add custom rules to handle fonts and images
config.module.rules.push(
  // Font loader for .otf, .ttf, .woff, etc.
  {
    test: /\.(woff2?|ttf|eot|otf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '/fonts/',
        },
      },
    ],
  },

  // Image loader
  {
    test: /\.(png|jpe?g|gif|webp|tiff)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
          outputPath: 'images/',
          publicPath: '/images/',
        },
      },
    ],
  }
);

module.exports = config;
