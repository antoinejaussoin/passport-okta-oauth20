
export type OktaScopes = "openid" | "email" | "profile" | string;

export type OktaStrategyOptions = {
  /**
   * This is the Okta domain, for example https://acme.okta.com.
   * Known as "Okta domain" under "General Settings" in your Okta settings.
   */
  audience: string;
  /**
   * This is the public identifier for the client.
   * Known as "Client ID" under "Client Credentials" in your Okta settings.
   */
  clientID: string;
  /**
   * Secret used by the client to exchange an authorization code for a token.
   * This must be kept confidential!
   * Do not include it in apps which cannot keep it secret, such as those running on a client.
   * Known as "Client secret" under "Client Credentials" in your Okta settings.
   */
  clientSecret: string;
  /**
   * Optional parameter to provide an identity provider.
   * It should be a 20 character string.
   */
  identityProvider?: string;
  /**
   * Scopes. Try `['openid', 'email', 'profile']` to start with.
   */
  scope: OktaScopes[];
  /**
   * The URL on your side that Okta is going to call back to.
   * This should match one of the URLs defined under "Sign-in redirect URIs" under "Login".
   */
  callbackURL: string;
};

export type OktaProfileEmail = { value: string };

export type OktaProfile = {
  /**
   * Authentication ID (a.k.a "sub" in Okta's response)
   */
  id: string;
  /**
   * Display Name (usually your full name, e.g. Alan Smith)
   */
  displayName: string;
  /**
   * Your username (usually your email)
   */
  username: string;
  /**
   * Locale (e.g. en/US)
   */
  locale: string;
  /**
   * Time zone information (e.g. Europe/Paris)
   */
  zoneInfo: string;
  /**
   * Time stamp of last update
   */
  updatedAt: number;
  /**
   * Whether your email was verified
   */
  emailVerified: boolean;
  /**
   * Name details
   */
  name: {
    /**
     * Your full name (same as displayName, e.g. Alan Smith)
     */
    fullName: string;
    /**
     * Your last name (e.g. Smith)
     */
    familyName: string;
    /**
     * Your first name (e.g. Alan)
     */
    givenName: string;
  };
  /**
   * List of emails
   */
  emails: OktaProfileEmail[];
  /**
   * Raw response as received from Okta
   */
  _raw: string;
  /**
   * JSON object parsed from _raw
   */
  _json: unknown;
};
