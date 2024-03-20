import {AuthToken, FakeData, User} from "tweeter-shared";

export class AuthenticateService {
    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken, string, boolean]> {
        let user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        // Serialize and deserialize to get token and user
        return [user, FakeData.instance.authToken, "Successful Login", true];
    };

    public async logout(authToken: AuthToken): Promise<[string, boolean]> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
        return ["Successful Logout", true]
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: string
    ): Promise<[User, AuthToken, string, boolean]> {
        let user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user, FakeData.instance.authToken, "Successful Registration", true];
    };
}