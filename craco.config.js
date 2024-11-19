const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify/browser'),
          path: require.resolve('path-browserify'),
          zlib: require.resolve('browserify-zlib'),
          querystring: require.resolve('querystring-es3'),
          url: require.resolve('url/'),
          buffer: require.resolve('buffer/'),
          process: require.resolve('process/browser'),
          fs: false,
          net: false,
          tls: false,
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ],
    },
  },
}; 