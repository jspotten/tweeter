import { User } from "../../domain/User"
import { AuthToken } from "../../domain/AuthToken"

interface ResponseJson {
    _success: boolean;
    _message: string;
}

export class AuthenticateResponse { //extends Response {
    private readonly _user: User;
    private readonly _token: AuthToken;

    constructor(
        user: User,
        token: AuthToken,
    ) {
        // super(success, message);
        this._user = user;
        this._token = token;
    }

    get user() {
        return this._user;
    }

    get token() {
        return this._token;
    }

    static fromJson(json: JSON): AuthenticateResponse {
        interface AuthenticateResponseJson extends ResponseJson {
            _user: JSON;
            _token: JSON;
        }

        const jsonObject: AuthenticateResponseJson =
            json as unknown as AuthenticateResponseJson;
        const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

        if (deserializedUser === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize user with json:\n" +
                JSON.stringify(jsonObject._user)
            );
        }

        const deserializedToken = AuthToken.fromJson(
            JSON.stringify(jsonObject._token)
        );

        if (deserializedToken === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize token with json:\n" +
                JSON.stringify(jsonObject._token)
            );
        }

        return new AuthenticateResponse(
            deserializedUser,
            deserializedToken,
            // jsonObject._message,
            // jsonObject._success,
        );
    }
}