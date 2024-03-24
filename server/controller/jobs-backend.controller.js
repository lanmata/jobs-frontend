let oauthClient = null;
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const axios = require('axios');
const config = require('config');
const jobsProxyConfig = appConfig.getJobsProxyConfig();
const oauthclient = require('../proxy/oauth-client');
const logger = appConfig.getLogger();
const apiServiceMap = JSON.parse(config.get('proxy.service.jobs.url'));
const httpContext = require('express-http-context');
const {v4: uuidv4} = require('uuid');
// const rest = require('restler');
const util = require('util');
const fs = require('fs');
const fsunlink = util.promisify(fs.unlink);
const needle = require('needle');

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_GRANT_TYPE = process.env.OAUTH_GRANT_TYPE;
const OAUTH_TOKEN_URL = process.env.OAUTH_TOKEN_URL;
const OAUTH_AUTHENTICATION_TYPE = process.env.OAUTH_AUTHENTICATION_TYPE;

const Agent = require('agentkeepalive');
const HttpsAgent = require('agentkeepalive').HttpsAgent;

const httpConnectionOptions = {
  keepAlive: true,
  maxSockets: 100,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000
};

const keepaliveAgent = new Agent(httpConnectionOptions);
const keepaliveHttpsAgent = new HttpsAgent(httpConnectionOptions);

let getApiEndpoint = function (path) {
  let finalPath = null;
  let applicationName = null;
  for (const element of jobsProxyConfig) {
    if (element.matchOn != null && element.matchOn.startWith != null && path.startsWith(element.matchOn.startWith)) {
      if (element.urlRewrite != null) {
        finalPath = path.replace(element.urlRewrite.from, element.urlRewrite.to);
      } else {
        finalPath = path;
      }
      applicationName = element.applicationName;
      break;
    }
  }

  let apiURL = apiServiceMap[applicationName];

  if (apiURL != null) {
    return apiURL + finalPath;
  } else {
    throw errorUtil.createErrorResponse(constants.NOT_FOUND_REQUEST_CODE,
      constants.NOT_FOUND_REQUEST_TITLE,
      constants.NOT_FOUND_REQUEST_DETAIL,
      constants.NOT_FOUND_REQUEST_CODE_VALUE);
  }
};

let getOauthClient = function () {
  if (oauthClient) {
    return oauthClient;
  }
  oauthClient = oauthclient.getOAuthClient({
    clientId: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    grantType: OAUTH_GRANT_TYPE,
    tokenUrl: OAUTH_TOKEN_URL,
    authenticationType: OAUTH_AUTHENTICATION_TYPE
  });
  return oauthClient;
}

exports.proxyApi = async (req, res, next) => {
  let response = null;
  try {
    const apiURL = getApiEndpoint(req.url);
    let token = null;
    // let token = await getOauthClient().getBearerToken();
    let headers = getBasicHeader(req, token, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT)

    // Trace
    logger.info(`[Jobs] Proxying request to ${apiURL}`);

    let httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
    let request = await axios(httpOptions);

    response = request.data;
    res.set(request.headers);

  } catch (error) {
    if (error.response != null) {
      response = error.response.data;
      res.status(error.response.status);
    } else if (error.errors != null) {
      response = error;
    }
  }
  res.send(response);
};

const getBasicHeader = function (req, token, defaultAccept, defaultContentType) {
  let headers = {}
  headers['FID-LOGGER-TRACKING-ID'] = req.header("FID-LOGGER-TRACKING-ID") == null ? uuidv4() : req.header("FID-LOGGER-TRACKING-ID");
  headers['FID-USER-ID'] = req.header("FID-USER-ID") == null ? "anonymous" : req.header("FID-USER-ID");
  headers['Authorization'] = `Bearer ${token}`;
  headers['Accept'] = req.header("Accept") == null ? constants.CONTENT_TYPE_DEFAULT : req.header("Accept");
  headers['Content-Type'] = req.header("Content-Type") == null ? constants.CONTENT_TYPE_DEFAULT : req.header("Content-Type");
  return headers;
}

let createRequestOption = function (method, url, body, headers) {
  return {
    method: method.toLowerCase(),
    url: url,
    data: body != null ? body : null,
    headers: headers,
    httpAgent: keepaliveAgent,
    httpsAgent: keepaliveHttpsAgent,
    responseType: headers['Accept'] === constants.CONTENT_TYPE_DEFAULT ? 'arraybuffer' : 'json'
  }
}

