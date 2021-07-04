import Strategy from '../Strategy';
import { OktaStrategyOptions } from '../types';

const fakeOptions: OktaStrategyOptions = {
  audience: 'https://acme.okta.com',
  clientID: 'fake-client-id',
  clientSecret: 'fake-client-secret',
  callbackURL: 'http://localhost:3000/api/okta/callback',
  scope: ['foo', 'bar'],
};

describe('Okta Strategy', () => {
  it('Should return the correct Strategy name', () => {
    const strategy = new Strategy(fakeOptions, console.log);
    expect(strategy.name).toBe('okta');
  });

  it('Should have calculated the correct URLs', () => {
    const strategy = new Strategy(fakeOptions, console.log);
    expect(strategy.options.authorizationURL).toBe(
      'https://acme.okta.com/oauth2/v1/authorize'
    );
    expect(strategy.options.tokenURL).toBe(
      'https://acme.okta.com/oauth2/v1/token'
    );
    expect(strategy.options.userInfoUrl).toBe(
      'https://acme.okta.com/oauth2/v1/userinfo'
    );
    expect(strategy.options.callbackURL).toBe(
      'http://localhost:3000/api/okta/callback'
    );
  });

  it('Should have stored the scope', () => {
    const strategy = new Strategy(fakeOptions, console.log);
    expect(strategy.options.scope).toStrictEqual(['foo', 'bar']);
  });

  it('Should have stored the secrets', () => {
    const strategy = new Strategy(fakeOptions, console.log);
    expect(strategy.options.clientID).toStrictEqual('fake-client-id');
    expect(strategy.options.clientSecret).toStrictEqual('fake-client-secret');
  });
});
