const path = require('path');

module.exports = {
  mode: 'development',
  context: path.join(__dirname, './'),
  entry: './src/index.js',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
        include: path.join(__dirname, 'src'),
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000
  }
};