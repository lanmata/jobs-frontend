process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.env.NODE_CONFIG_DIR = __dirname + "/server/config";

const httpContext = require('express-http-context');
const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const appConfig = require('./server/config/app.config');
const compression = require('compression');
const app = express();
const cors = require('cors');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./ssl/manager-front.key'),
  cert: fs.readFileSync('./ssl/manager-front.crt')
}


app.use(httpContext.middleware);
// appConfig.configureAccessLog(app);

let logger = appConfig.getLogger();
// Parsers for POST data
app.use(compression());
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

// Get port from environment and store in Express.
const port = '7001';
app.set('port', port);

// Call bootstrap method which calls iConfig
appConfig.bootstrapConfiguration(app).then(
  config => {
    appConfig.createJobsProxyConfig();

    app.use("/", require("./server/routes/jobs-backend.routes"));
    app.use(express.static("dist/jobs-frontend/browser"));
    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/jobs-frontend/browser", "index.html"));
    });
  },
  err => {
    logger.error("Error in bootstrapping application", err);
  }
);

const server = https.createServer(options, app);

server.listen(port, () => logger.info(`UI running on localhost:${port}`));
