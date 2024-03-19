import {AuthToken, FakeData, User} from "tweeter-shared";

export class AuthenticateService {
    login = async (
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> => {
        // TODO: Replace with the result of calling the server
        let user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        // Serialize and deserialize to get token and user
        return [user, FakeData.instance.authToken];
    };
}