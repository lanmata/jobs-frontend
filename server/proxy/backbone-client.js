const assert = require('assert');
const axios = require('axios');
const {BEARER} = require("../config/constants.util");

class BackboneClient {

    constructor(config) {
        assert.ok(config, "BackboneClient: config is not defined");
        assert.ok(config.url, "BackboneClient: config.url is not defined");

        this.url = config.url;
    }

    getToken = async (user, password, bearerToken) => {
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': BEARER + bearerToken
            },
            data: {
                'alias': user,
                'password': password
            },
            url: this.url
        }

        const backboneResponse = await axios(options);
        return backboneResponse.data;
    };
}

/**
 * Retrieves the API endpoint for a given path.
 */
module.exports.getBackbone = function (backboneConfig) {
    return new BackboneClient(backboneConfig);
};