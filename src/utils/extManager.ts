import { UserManager } from "oidc-client";

const isProd = process.env.NODE_ENV === "production";

export class AppUserManager extends UserManager {
  constructor() {
    const uri = isProd
      ? "https://dms.xiaopangying.com"
      : "http://localhost:8080";

    super({
      authority: "https://idc.xiaopangying.com",
      client_id: "jeremy.dms.example",
      redirect_uri: `${uri}/callback`,
      silent_redirect_uri: `${uri}/callback`,
      accessTokenExpiringNotificationTime: 3,
      silentRequestTimeout: 2000,
      response_type: "id_token token",
      scope: "openid profile email",
      post_logout_redirect_uri: `${uri}/logout`,
      filterProtocolClaims: true
    });
  }

  async login() {
    await this.signinRedirect();
    const user = await this.getUser();
    console.log(user);
    return user;
  }

  async logout() {
    return this.signoutRedirect();
  }
}

export const manager = new AppUserManager();
