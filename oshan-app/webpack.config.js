const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack'); // Import webpack

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Enable source maps in production for better debugging
      devtool: env.mode === 'development' ? 'cheap-module-source-map' : false,
    },
    argv
  );

  // Add polyfills for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "url": require.resolve("url/"),
    "net": false,
    "tls": false,
    "dns": false,
    "zlib": false,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "child_process": false,
    "timers": require.resolve("timers-browserify"),
    "process": require.resolve("process/browser"),
  };

  // Ignore MongoDB and related packages for web builds
  config.resolve.alias = {
    ...config.resolve.alias,
    'mongodb': false,
    'mongodb-connection-string-url': false,
    '@mongodb-js/saslprep': false,
    'dotenv': false,
    // Alias for React Native specific modules that cause issues on web
    'vm': 'vm-browserify', // Polyfill for vm
    // Exclude react-native-firebase and react-native-google-signin from web build
    '@react-native-firebase/app': false,
    '@react-native-google-signin/google-signin': false,
    'react-native/Libraries/vendor/emitter/EventEmitter': false, // Explicitly ignore this problematic path
  };

  // Add necessary plugins
  // const webpack = require('webpack'); // Already imported at the top
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^(firebase|@react-native-firebase|@react-native-google-signin)$/,
    })
  );

  return config;
};