/**
 * OAuth client instance.
 * @type {Object|null}
 */
let backboneClient = null;

const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const axios = require('axios');
const jobsProxyConfig = appConfig.getJobsProxyConfig();
const oauthclient = require('../proxy/oauth-client');
const backboneclient = require('../proxy/backbone-client');
const logger = appConfig.getLogger();
const {v4: uuidv4} = require('uuid');

const API_SERVICE_JOBS_SESSION_RELATIVE_PATH = process.env.API_SERVICE_JOBS_SESSION_RELATIVE_PATH;
const API_SERVICE_JOBS_MAP = JSON.parse(process.env.API_SERVICE_JOBS_MAP);
const OAUTH_AUTHENTICATION_TYPE = process.env.AUTH_AUTHENTICATION_TYPE;
const OAUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
const OAUTH_GRANT_TYPE = process.env.AUTH_GRANT_TYPE;
const OAUTH_TOKEN_URL = process.env.AUTH_SERVER_URI;
const OAUTH_USER_ALIAS = process.env.AUTH_USER_ALIAS;
const OAUTH_USER_PASSWORD = process.env.AUTH_USER_PASSWORD;

const BACKBONE_API_SERVICE_MAP = JSON.parse(process.env.BACKBONE_API_SERVICE_MAP);
const BACKBONE_OAUTH_AUTHENTICATION_TYPE = process.env.BACKBONE_AUTH_AUTHENTICATION_TYPE;
const BACKBONE_OAUTH_CLIENT_ID = process.env.BACKBONE_AUTH_CLIENT_ID;
const BACKBONE_OAUTH_CLIENT_SECRET = process.env.BACKBONE_AUTH_CLIENT_SECRET;
const BACKBONE_OAUTH_GRANT_TYPE = process.env.BACKBONE_AUTH_GRANT_TYPE;
const BACKBONE_OAUTH_TOKEN_URL = process.env.BACKBONE_AUTH_SERVER_URI;
const BACKBONE_OAUTH_USER_ALIAS = process.env.BACKBONE_AUTH_USER_ALIAS;
const BACKBONE_OAUTH_USER_PASSWORD = process.env.BACKBONE_AUTH_USER_PASSWORD;

const Agent = require('agentkeepalive');
const {AUTHORIZATION, BEARER, SESSION_TOKEN_BKD, FID_LOGGER_TRACKING_ID, CONTENT_TYPE, FID_USER_ID,
    CONTENT_TYPE_DEFAULT, ACCEPT
} = require("../config/constants.util");
const HttpsAgent = require('agentkeepalive').HttpsAgent;

/**
 * Jobs OAuth client configuration.
 * @type {{password: string, clientId: string, tokenUrl: string, clientSecret: string, authenticationType: string, grantType: string, username: string}}
 */
const jobsOauthClientConfig = {
    clientId: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    grantType: OAUTH_GRANT_TYPE,
    tokenUrl: OAUTH_TOKEN_URL,
    authenticationType: OAUTH_AUTHENTICATION_TYPE,
    username: OAUTH_USER_ALIAS,
    password: OAUTH_USER_PASSWORD
};
/**
 * Backbone OAuth client configuration.
 * @type {{password: string, clientId: string, tokenUrl: string, clientSecret: string, authenticationType: string, grantType: string, username: string}}
 */
const backboneOauthClientConfig = {
    clientId: BACKBONE_OAUTH_CLIENT_ID,
    clientSecret: BACKBONE_OAUTH_CLIENT_SECRET,
    grantType: BACKBONE_OAUTH_GRANT_TYPE,
    tokenUrl: BACKBONE_OAUTH_TOKEN_URL,
    authenticationType: BACKBONE_OAUTH_AUTHENTICATION_TYPE,
    username: BACKBONE_OAUTH_USER_ALIAS,
    password: BACKBONE_OAUTH_USER_PASSWORD
};

/**
 * HTTP connection options.
 * @type {{maxFreeSockets: number, keepAlive: boolean, maxSockets: number, freeSocketTimeout: number, timeout: number}}
 */
const httpConnectionOptions = {
    keepAlive: true,
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000
};

/**
 * Keepalive agent for HTTP connections.
 * @type {AgentKeepAlive} keepaliveAgent
 */
const keepaliveAgent = new Agent(httpConnectionOptions);

/**
 * Keepalive agent for HTTPS connections.
 * @type {keepaliveHttpsAgent.HttpsAgent} keepaliveHttpsAgent
 */
const keepaliveHttpsAgent = new HttpsAgent(httpConnectionOptions);

/**
 * Retrieves the API endpoint for a given path.
 *
 * @param {string} path - The request path.
 * @returns {string} - The full API endpoint URL.
 * @throws {Error} - Throws an error if the API endpoint is not found.
 */
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
    let apiURL = API_SERVICE_JOBS_MAP[applicationName];

    if (apiURL != null) {
        return apiURL + finalPath;
    } else {
        throw errorUtil.createErrorResponse(constants.NOT_FOUND_REQUEST_CODE,
            constants.NOT_FOUND_REQUEST_TITLE,
            constants.NOT_FOUND_REQUEST_DETAIL,
            constants.NOT_FOUND_REQUEST_CODE_VALUE);
    }
};

/**
 * Retrieves the backbone client instance, initializing it if necessary.
 * @returns {Object}
 */
let getBackboneClient = function () {
    let backboneApiURL = BACKBONE_API_SERVICE_MAP['backbone'] + '/backbone/v1/session';
    if (backboneClient) {
        return backboneClient;
    }
    backboneClient = backboneclient.getBackbone({
        url: backboneApiURL
    });
    return backboneClient;
}

/**
 * Retrieves the OAuth client instance, initializing it if necessary.
 *
 * @returns {Object} - The OAuth client instance.
 */
let getOauthClient = function (oauthClientConfig) {
    let oauthClient;
    oauthClient = oauthclient.getOAuthClient(oauthClientConfig);
    return oauthClient;
}

/**
 * Retrieves the session token for the backbone service.
 *
 * @param req
 * @returns {Promise<*>}
 */
const backboneSessionToken = async (req) => {
    let backboneSession = null;
    if (req.url === API_SERVICE_JOBS_SESSION_RELATIVE_PATH) {
        const backboneToken = await getOauthClient(backboneOauthClientConfig).getBearerToken();
        backboneSession = await getBackboneClient().getToken(req.body.alias, req.body.password, backboneToken);
    }
    return backboneSession?.token;
}

/**
 * Proxies API requests to the appropriate backend service.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.proxyApi = async (req, res, next) => {
    let response = null;
    try {
        const apiURL = getApiEndpoint(req.url);
        let jobsToken = await getOauthClient(jobsOauthClientConfig).getBearerToken();
        let backboneSession = await backboneSessionToken(req);
        let headers = getBasicHeader(req, jobsToken, backboneSession, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);
        // Trace
        logger.info(`[Jobs] Proxying request to ${apiURL}`);
        let httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
        let request = await axios(httpOptions);

        delete request.headers['transfer-encoding'];
        response = request.data;
        res.set(request.headers);
        // Set headers from the request to the response
        Object.keys(req.headers).forEach(header => {
            res.set(header, req.headers[header]);
        });
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

/**
 * Constructs the basic headers for the proxied request.
 *
 * @param {Object} req - The request object.
 * @param jobsToken - The token for the jobs service.
 * @param backboneSession - The session token for the backbone service.
 * @param {string} defaultAccept - The default Accept header value.
 * @param {string} defaultContentType - The default Content-Type header value.
 * @returns {Object} - The constructed headers.
 */
const   getBasicHeader = function (req, jobsToken, backboneSession, defaultAccept, defaultContentType) {
    let headers = {};
    headers[FID_LOGGER_TRACKING_ID] = req.header(FID_LOGGER_TRACKING_ID) == null ? uuidv4() : req.header(FID_LOGGER_TRACKING_ID);
    headers[FID_USER_ID] = req.header(FID_USER_ID) == null ? "anonymous" : req.header(FID_USER_ID);
    headers[AUTHORIZATION] = BEARER+jobsToken;
    headers[ACCEPT] = req.header(ACCEPT) == null ? defaultAccept : req.header(ACCEPT);
    if(req.url.toString().indexOf('/api/v1/report') !== -1) {
        headers[CONTENT_TYPE] = 'application/octet-stream';
    } else {
        headers[CONTENT_TYPE] = req.header(CONTENT_TYPE) == null ? defaultContentType : req.header(CONTENT_TYPE);

    }

    if(req.header(SESSION_TOKEN_BKD) !== null) {
        headers[SESSION_TOKEN_BKD] = req.header(SESSION_TOKEN_BKD);
    }

    if (backboneSession) {
        headers[SESSION_TOKEN_BKD] = backboneSession;
    }

    return headers;
}

/**
 * Creates the request options for the proxied request.
 *
 * @param {string} method - The HTTP method.
 * @param {string} url - The request URL.
 * @param {Object} body - The request body.
 * @param {Object} headers - The request headers.
 * @returns {Object} - The constructed request options.
 */
let createRequestOption = function (method, url, body, headers) {
    return {
        method: method.toLowerCase(),
        url: url,
        data: body != null ? body : null,
        headers: headers,
        httpAgent: keepaliveAgent,
        httpsAgent: keepaliveHttpsAgent,
        responseType: headers[ACCEPT] === CONTENT_TYPE_DEFAULT ? 'blob' : 'json'
    }
}