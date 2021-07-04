# passport-okta-oauth20

[Okta](https://www.okta.com) OAuth 2.0 provider for [Passport](https://www.passportjs.org) with TypeScript support.

## Installation

`npm i passport-okta-oauth20` or `yarn add passport-okta-oauth20`.

## Usage

- Import: `import { Strategy as OktaStrategy } from 'passport-okta-oauth20';`
- Profit:

```tsx
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
      return done(null, profile);
    }
  )
);
```

## Profile

You can access to the profile type by importing it:
- `import { OktaProfile } from 'passport-okta-oauth20'`

The profile given by the strategy callback is of course typed.

Example profile:

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

## Change Log

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