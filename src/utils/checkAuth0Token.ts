import { auth } from 'express-oauth2-jwt-bearer';

export const checkAuth0Token = auth({
  audience: 'https://trainem.authentication',
  issuerBaseURL: 'https://dev-wmcuuu42i1iqwc5e.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});