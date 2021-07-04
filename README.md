# passport-okta-oauth20

![GitHub package.json version](https://img.shields.io/github/package-json/v/antoinejaussoin/passport-okta-oauth20)
![Dependencies](https://img.shields.io/depfu/antoinejaussoin/passport-okta-oauth20)
![Code Quality](https://img.shields.io/npms-io/quality-score/passport-okta-oauth20)
![Maintenance](https://img.shields.io/npms-io/maintenance-score/passport-okta-oauth20)

[Okta](https://www.okta.com) OAuth 2.0 provider for [Passport](https://www.passportjs.org) with TypeScript support.

## Installation

`npm i passport-okta-oauth20` or `yarn add passport-okta-oauth20`.

## Usage

```tsx
import { Strategy as OktaStrategy } from 'passport-okta-oauth20';

passport.use(
  new OktaStrategy(
    {
      audience: 'https://acme.okta.com',
      clientID: 'oa6qp1vkvrgwABC12345',
      clientSecret: 'qwertyA-fooBazB_DQSS-qqsQSD123',
      scope: ['openid', 'email', 'profile'],
      callbackURL: 'http://localhost:3000/api/auth/okta/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // Do something with the profile
      return done(null, profile);
    }
  )
);
```

## Profile

```js
{
  id: 'azerty12345890',
  displayName: 'Adam Smith',
  username: 'adam@smith.com',
  fullName: 'Adam Smith',
  familyName: 'Smith',
  givenName: 'Adam',
  email: 'adam@smith.com',
  zoneInfo: 'America/Los_Angeles',
  updatedAt: 1625319840,
  emailVerified: true,
  locale: 'en-US',
  _raw: '{"sub":"azerty12345890", ...',
  _json: Object // Raw response from Okta
}
```

## TypeScript

If you are using TypeScript, you can import the following types:

`import { OktaProfile, OktaStrategyOptions } from 'passport-okta-oauth20'`



## Change Log

### Version 1.0.1

- Testing on Node 12, 14 and 16
- Replace `.npmignore` by a whitelist (`files`) in `package.json`
- Restrict to Node >= 12 (but will probably work with older version.)
- Testing both the original TypeScript code and the transpiled JS code

### Version 1.0.0

- Functional parity with [passport-okta-oauth](https://github.com/techstars-archive/passport-okta-oauth)
- Full TypeScript support
- Simplified logic and up-to-date dependencies
- Very lightweight NPM package (6.2 kB)
- Test coverage
- Linting

## Prior art

This repository is loosely based on [passport-okta-oauth](https://github.com/techstars-archive/passport-okta-oauth).

That repository was archived a while ago, and this rewrite brings the following changes:

- Full native TypeScript support
- Simplified logic
- Using node-fetch for fetching the profile instead of a private function from [oauth](https://github.com/ciaranj/node-oauth/blob/master/lib/oauth2.js).
- Update to the user profile (Okta added new fields that were not present in the original library)
- Unit testing
- Linting
- CI