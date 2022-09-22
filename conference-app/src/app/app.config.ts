export default {
  okta: {
    clientId: '0oa16iqk31vLdqgPH4x7',
    issuer: 'https://dev-298855.okta.com/oauth2/aus4mr92gy4CPjq4J4x7',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
  },
  serviceURLs: {
    speaker: 'http://localhost:8881/',
    session: 'http://localhost:8882/'
  }
};
