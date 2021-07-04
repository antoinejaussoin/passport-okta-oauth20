import { Strategy, StrategyOptions, InternalOAuthError } from 'passport-oauth2';
import { OktaProfile, OktaStrategyOptions } from './types';

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

function toBaseStrategyOption(
  options: OktaStrategyOptions
): InternalStrategyOptions {
  return {
    ...options,
    authorizationURL: options.audience + '/oauth2/v1/authorize',
    tokenURL: options.audience + '/oauth2/v1/token',
    userInfoUrl: options.audience + '/oauth2/v1/userinfo',
    state: true,
  };
}

class OktaStrategy extends Strategy {
  public name = 'okta';
  private options: InternalStrategyOptions;
  constructor(options: OktaStrategyOptions, verify: OktaCallback) {
    super(toBaseStrategyOption(options), verify);
    this.options = toBaseStrategyOption(options);
  }

  userProfile(accessToken: string, done: DoneCallback): void {
    const postHeaders = { Authorization: 'Bearer ' + accessToken };
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    this._oauth2._request(
      'POST',
      this.options.userInfoUrl,
      postHeaders,
      '',
      null,
      function (err, body, _res) {
        if (err) {
          return done(
            new InternalOAuthError('Error while fetching the user profile', err)
          );
        }
        try {
          const json = JSON.parse(body as string);

          const profile: OktaProfile = {
            id: json.sub,
            displayName: json.name,
            username: json.preferred_username,
            name: {
              fullName: json.name,
              familyName: json.family_name,
              givenName: json.given_name,
            },
            emails: [{ value: json.email }],
            zoneInfo: json.zoneinfo,
            updatedAt: json.updated_at,
            emailVerified: json.email_verified,
            locale: json.locale,
            _raw: body as string,
            _json: json,
          };
          done(null, profile);
        } catch (e) {
          done(e);
        }
      }
    );
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
