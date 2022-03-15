import { Strategy, StrategyOptions, InternalOAuthError } from 'passport-oauth2';
import { OktaProfile, OktaStrategyOptions } from './types';
import fetch from 'node-fetch';

type DoneCallback = (
  err?: Error | null | undefined,
  profile?: OktaProfile
) => void;

type OktaCallback = (
  accessToken: string,
  refreshToken: string,
  profile: OktaProfile,
  done: DoneCallback
) => void;

type InternalStrategyOptions = OktaStrategyOptions &
  StrategyOptions & {
    userInfoUrl: string;
  };

type AuthorizationParams = {
  idp?: string;
};

function toInternalStrategyOption(
  options: OktaStrategyOptions
): InternalStrategyOptions {
  const authIssuer = `${options.audience}/oauth2${
    options.authorizationId ? '/' + options.authorizationId : ''
  }`;
  return {
    ...options,
    authorizationURL: `${authIssuer}/v1/authorize`,
    tokenURL: `${authIssuer}/v1/token`,
    userInfoUrl: `${authIssuer}/v1/userinfo`,
    state: true,
  };
}

class OktaStrategy extends Strategy {
  public name = 'okta';
  public options: InternalStrategyOptions;
  constructor(options: OktaStrategyOptions, verify: OktaCallback) {
    super(toInternalStrategyOption(options), verify);
    this.options = toInternalStrategyOption(options);
  }

  userProfile(accessToken: string, done: DoneCallback): void {
    fetch(this.options.userInfoUrl, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken },
    }).then((response) => {
      if (!response.ok) {
        response.json().then((err) => {
          console.error('Error while fetching the user profile: ', err);
          return done(
            new InternalOAuthError('Error while fetching the user profile', err)
          );
        });
      } else {
        response.json().then((json) => {
          const profile: OktaProfile = {
            id: json.sub,
            displayName: json.name,
            username: json.preferred_username,
            fullName: json.name,
            familyName: json.family_name,
            givenName: json.given_name,
            email: json.email,
            zoneInfo: json.zoneinfo,
            updatedAt: json.updated_at,
            emailVerified: json.email_verified,
            locale: json.locale,
            _raw: JSON.stringify(json),
            _json: json,
          };
          done(null, profile);
        });
      }
    });
  }

  authorizationParams(): AuthorizationParams {
    const params: AuthorizationParams = {};
    if (this.options.identityProvider) {
      params.idp = this.options.identityProvider;
    }
    return params;
  }
}

export default OktaStrategy;
