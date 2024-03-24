let jobsProxyConfig = {};
const fs = require('fs');
const path = require('path');
const {format} = require('logform');
const winston = require('winston');
const jwt = require('jsonwebtoken');


module.exports.bootstrapConfiguration = function(app) {
  const argv = require('yargs').argv;

  return new Promise(function(resolve, reject) {
    require('dotenv').config({path: "default.env"});

    if(argv.vaultToken && argv.vaultUrl && argv.vaultPath) {
      loadSecretsIntoEnv(argv.vaultUrl, argv.vaultToken, argv.vaultPath).then(config => {
        logger.info("Loaded secrets from vault");
        resolve(config);

      }, error => {
        logger.error("Unable to load secrets from vault");
        reject(error);
      });
    } else {
      logger.info("No vault configuration found");
      resolve(null);
    }
  });
};

let loadSecretsIntoEnv = function(vaultUrl, vaultToken, vaultPath) {
  return new Promise(function(resolve, reject) {
    let vaultClient = require("node-vault-client");

    vaultClient = vaultClient.boot('main', {
      api: {url: vaultUrl },
      auth: {
        type: 'token',
        config: { token: vaultToken }
      },
    });

    vaultClient.list(vaultPath).then(secrets => {
      let secretList = secrets["data"]["keys"];

      logger.info(`Loading secrets from vault: ${secretList}`);
      let promiseList = [];

      for(let secret of secretList) {
        promiseList.push(vaultClient.read(`${path}/${secret}`));
      }

      Promise.all(promiseList).then(function(values) {
        for(let i = 0; i < secretList.length; i++) {
          process.env[secretList[i]] = values[i]["__data"][secretList[i]];
        }
        logger.info("Loaded secrets from vault");
        const config = require('config');
        resolve(config);
      });
    }, error => {
      logger.error("Unable to load secrets from vault", error);
      reject("Unable to load secrets from vault", error);
    });

  });
};

module.exports.getLogger = function() {
  return winston.createLogger({
    format: format.combine(
      format.json(),
      format.timestamp(),
    ),
    transports: [
      new winston.transports.Console()
    ]
  });
};

module.exports.createJobsProxyConfig = function () {
  const configJson = fs.readFileSync('server/config/config.json', 'utf8');
  const config = JSON.parse(configJson);
  jobsProxyConfig = config['jobBackendProxyConfig'];
  logger.info("[Job] - Proxy Config: " + JSON.stringify(jobsProxyConfig));
};

module.exports.getJobsProxyConfig = function() {
  return jobsProxyConfig;
};

const logger = this.getLogger();
