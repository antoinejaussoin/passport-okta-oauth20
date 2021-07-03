import Strategy, { OktaStrategyOptions } from "../Strategy";

const fakeOptions: OktaStrategyOptions = {
  audience: "https://acme.okta.com",
  clientID: "fake-client-id",
  clientSecret: "fake-client-secret",
  response_type: "code",
  callbackURL: "http://localhost:3000/api/okta/callback",
  scope: ["foo", "bar"],
};

describe("Okta Strategy", () => {
  it("Should return the correct Strategy name", () => {
    const strategy = new Strategy(fakeOptions, () => {});
    expect(strategy.name).toBe("okta");
  });
});
