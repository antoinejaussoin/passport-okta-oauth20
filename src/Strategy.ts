import { Strategy, StrategyOptions, InternalOAuthError } from 'passport-oauth2';
import queryString from 'querystring';
import { OktaProfile, OktaStrategyOptions } from './types';

type OktaCallback = (
  accessToken: string,
  refreshToken: string,
  profile: OktaProfile,
  done: Function
) => void;

type InternalStrategyOptions = OktaStrategyOptions &
  StrategyOptions & {
    userInfoUrl: string;
  };

type AuthorizationParams = {
  idp?: string;
};

class OktaStrategy extends Strategy {
  public name = 'okta';
  private options: InternalStrategyOptions;
  constructor(options: OktaStrategyOptions, verify: OktaCallback) {
    super(
      {
        ...options,
        authorizationURL: options.audience + '/oauth2/v1/authorize',
        tokenURL: options.audience + '/oauth2/v1/token',
        state: true,
      },
      verify
    );
    this.options = {
      ...options,
      authorizationURL: options.audience + '/oauth2/v1/authorize',
      tokenURL: options.audience + '/oauth2/v1/token',
      userInfoUrl: options.audience + '/oauth2/v1/userinfo',
      state: true,
    };
    this._oauth2.getOAuthAccessToken = (code, params, callback?: Function) => {
      const _params: any = params || {};
      const _codeParam =
        params.grant_type === 'refresh_token' ? 'refresh_token' : 'code';
      params[_codeParam] = code;
      const postData = queryString.stringify(_params);
      const postHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic: ' +
          Buffer.from(options.clientID + ':' + options.clientSecret).toString(
            'base64'
          ),
      };
      // @ts-ignore
      this._oauth2._request(
        'POST',
        // @ts-ignore
        this._oauth2._getAccessTokenUrl(),
        postHeaders,
        postData,
        null,
        function (error, data, response) {
          if (error && callback) {
            callback(error);
          } else {
            let results;
            try {
              // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
              // responses should be in JSON
              results = JSON.parse(data as string);
            } catch (e) {
              // .... However both Facebook + Github currently use rev05 of the spec
              // and neither seem to specify a content-type correctly in their response headers :(
              // clients of these services will suffer a *minor* performance cost of the exception
              // being thrown
              results = queryString.parse(data as string);
            }
            var access_token = results['access_token'];
            var refresh_token = results['refresh_token'];
            delete results['refresh_token'];
            if (callback) {
              callback(null, access_token, refresh_token, results); // callback results =-=
            }
          }
        }
      );
    };
  }

  userProfile(accessToken: string, done: Function) {
    const postHeaders = { Authorization: 'Bearer ' + accessToken };
    // @ts-ignore
    this._oauth2._request(
      'POST',
      this.options.userInfoUrl,
      postHeaders,
      '',
      null,
      function (err, body, res) {
        if (err) {
          return done(
            new InternalOAuthError('failed to fetch user profile', err)
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
