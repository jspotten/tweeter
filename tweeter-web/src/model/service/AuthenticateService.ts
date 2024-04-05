import {
    AuthToken,
    LoginRequest,
    LogoutRequest,
    RegisterRequest,
    User
} from "tweeter-shared";
import {Buffer} from "buffer";
import {ServerFacade} from "../network/ServerFacade";

export class AuthenticateService {
    protected facade = new ServerFacade();

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const loginRequest = new LoginRequest(alias, password);
        let loginResponse
            = await this.facade.login(loginRequest)

        const user = User.fromJson(JSON.stringify(loginResponse.user))
        const token = AuthToken.fromJson(JSON.stringify(loginResponse.token))
        if (user === null || token === null) {
            throw new Error("Invalid alias or password");
        }

        return [user, token];
    };

    public async logout(authToken: AuthToken): Promise<void> {
        const logoutRequest = new LogoutRequest(authToken);
        const logoutResponse = await this.facade.logout(logoutRequest);
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
    ): Promise<[User, AuthToken]> {

        const registerRequest = new RegisterRequest(
            firstName,
            lastName,
            alias,
            password,
            this.getStringBase64Img(userImageBytes),
        )
        const registerResponse
            = await this.facade.register(registerRequest)

        const user = User.fromJson(JSON.stringify(registerResponse.user))
        const token = AuthToken.fromJson(JSON.stringify(registerResponse.token))

        if (user === null || token === null) {
            throw new Error("Invalid registration");
        }

        return [user, token];
    };

    private getStringBase64Img(imgBytes: Uint8Array)
    {
        return Buffer.from(imgBytes).toString("base64");
    }
}