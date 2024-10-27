/**
 * OAuth client instance.
 * @type {Object|null}
 */
let oauthClient = null;

const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const axios = require('axios');
const config = require('config');
const jobsProxyConfig = appConfig.getJobsProxyConfig();
const oauthclient = require('../proxy/oauth-client');
const logger = appConfig.getLogger();
const httpContext = require('express-http-context');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const fs = require('fs');
const fsunlink = util.promisify(fs.unlink);
const needle = require('needle');

const API_SERVICE_JOBS_MAP = JSON.parse(process.env.API_SERVICE_JOBS_MAP);
const OAUTH_AUTHENTICATION_TYPE = process.env.AUTH_AUTHENTICATION_TYPE;
const OAUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
const OAUTH_GRANT_TYPE = process.env.AUTH_GRANT_TYPE;
const OAUTH_TOKEN_URL = process.env.AUTH_SERVER_URI;
const OAUTH_USER_ALIAS = process.env.AUTH_USER_ALIAS;
const OAUTH_USER_PASSWORD = process.env.AUTH_USER_PASSWORD;

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
 * Retrieves the OAuth client instance, initializing it if necessary.
 *
 * @returns {Object} - The OAuth client instance.
 */
let getOauthClient = function () {
    if (oauthClient) {
        return oauthClient;
    }
    oauthClient = oauthclient.getOAuthClient({
        clientId: OAUTH_CLIENT_ID,
        clientSecret: OAUTH_CLIENT_SECRET,
        grantType: OAUTH_GRANT_TYPE,
        tokenUrl: OAUTH_TOKEN_URL,
        authenticationType: OAUTH_AUTHENTICATION_TYPE,
        username: OAUTH_USER_ALIAS,
        password: OAUTH_USER_PASSWORD
    });
    return oauthClient;
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
        let token = await getOauthClient().getBearerToken();
        let headers = getBasicHeader(req, token, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);

        // Trace
        logger.info(`[Jobs] Proxying request to ${apiURL}`);

        let httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
        let request = await axios(httpOptions);

        delete request.headers['transfer-encoding'];
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

/**
 * Constructs the basic headers for the proxied request.
 *
 * @param {Object} req - The request object.
 * @param {string} token - The OAuth bearer token.
 * @param {string} defaultAccept - The default Accept header value.
 * @param {string} defaultContentType - The default Content-Type header value.
 * @returns {Object} - The constructed headers.
 */
const getBasicHeader = function (req, token, defaultAccept, defaultContentType) {
    let headers = {};
    headers['FID-LOGGER-TRACKING-ID'] = req.header("FID-LOGGER-TRACKING-ID") == null ? uuidv4() : req.header("FID-LOGGER-TRACKING-ID");
    headers['FID-USER-ID'] = req.header("FID-USER-ID") == null ? "anonymous" : req.header("FID-USER-ID");
    headers['Authorization'] = `Bearer ${token}`;
    headers['Accept'] = req.header("Accept") == null ? defaultAccept : req.header("Accept");
    headers['Content-Type'] = req.header("Content-Type") == null ? defaultContentType : req.header("Content-Type");
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
        responseType: headers['Accept'] === constants.CONTENT_TYPE_DEFAULT ? 'arraybuffer' : 'json'
    }
}