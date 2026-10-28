export type Customer = {
  customerId: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  makerSlug: string | null; // set once the customer submits their first app
};

export type CustomerTokens = {
  tokenType: "Bearer";
  accessToken: string;
  accessTokenExpiresIn: number; // seconds
  refreshToken: string;
  refreshTokenExpiresIn: number; // seconds
  customer: Customer;
};

export type GoogleLoginRequest = {
  idToken: string; // the `credential` JWT from Google Identity Services
};

export type EmailSignInRequest = { email: string; password: string };
export type EmailSignUpRequest = EmailSignInRequest & { displayName: string };
export type ResetPasswordRequest = { token: string; password: string };
