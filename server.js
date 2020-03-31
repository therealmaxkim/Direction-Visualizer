const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Special piece for running with webpack dev server
if (process.env.NODE_ENV === "development") {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  // Tell express to use the webpack-dev-middleware and use the webpack.config.js configuration file as a base.
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}

app.use(express.static('public'));

app.get("/", function(req , res) {
  res.sendFile(__dirname + '/src/index.html');
});


//app.get('/api/tweets', async (req, res) => {});


// listen for requests :)
const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
