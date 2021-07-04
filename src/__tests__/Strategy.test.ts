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
});
