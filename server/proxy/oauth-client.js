const assert = require('assert');
const axios = require('axios');
const AuthenticationType = {
  OPAQUE: "OPAQUE",
  JWT: "JWT"
}

class OAuthClient {
  clientId;
  clientSecret;
  grantType;
  tokenUrl;
  authenticationType;
  tokenCachePeriod = 1800;
  cacheToken;
  lastRequestTime = 0;

  constructor(config) {
    assert.ok(config, "OAuthClient: config is not defined");
    assert.ok(config.clientId, `OAuthClient: config.clientId is not provided for Auth Type: ${config.authenticationType}`);
    assert.ok(config.clientSecret, `OAuthClient: config.clientSecret is not provided for Auth Type: ${config.authenticationType}`);
    assert.ok(config.grantType, `OAuthClient: config.grantType is not provided for Auth Type: ${config.authenticationType}`);

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.grantType = config.grantType;
    this.tokenUrl = config.tokenUrl;
    this.authenticationType = config.authenticationType;
  }

  getBearerToken = async() => {
    const requestTime = new Date().getTime();
    if(this.cacheToken === undefined || this.cacheToken === "" || (requestTime - this.lastRequestTime) / 1000 > this.tokenCachePeriod) {
      let options = {};
      if(this.authenticationType === AuthenticationType.OPAQUE) {
        options = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: this.grantType,
            scope: "AppIdClaimsTrust"
          }),
          url: this.tokenUrl
        };
      } else  {
        options = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: this.grantType
          },
          url: this.tokenUrl
        };
      }

      // Call OAuth service
      const oauthResponse = await axios(options);
      // Cache token in local variable.
      this.cacheToken = oauthResponse.data.access_token;
      this.lastRequestTime = requestTime;
      return this.cacheToken;
    } else {
      return this.cacheToken;
    }
  };
}

module.exports.getOAuthClient = function(oauthClientConfig) {
  return new OAuthClient(oauthClientConfig);
}
