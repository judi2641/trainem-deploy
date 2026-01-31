"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth0Token = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
exports.checkAuth0Token = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: 'https://trainem.authentication',
    issuerBaseURL: 'https://dev-wmcuuu42i1iqwc5e.us.auth0.com/',
    tokenSigningAlg: 'RS256',
});
