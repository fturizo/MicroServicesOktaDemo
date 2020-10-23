export default {
  okta: {
    clientId: '0oa16iqk31vLdqgPH4x7',
    issuer: 'https://dev-298855.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
  },
  serviceURLs:{
    speaker: 'http://localhost:8881/',
    session: 'http://localhost:8882/'
  }
};
