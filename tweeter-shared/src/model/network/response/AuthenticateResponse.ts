import { User } from "../../domain/User"
import { AuthToken } from "../../domain/AuthToken"
import { TweeterResponse} from "./Response";

interface ResponseJson {
    _success: boolean;
    _message: string;
}

export class AuthenticateResponse implements TweeterResponse {
    private readonly _user: User;
    private readonly _token: AuthToken;
    readonly _success: boolean;
    readonly _message: string | undefined;

    constructor(
        user: User,
        token: AuthToken,
        message: string,
        success: boolean,

    ) {
        this._user = user;
        this._token = token;
        this._message = message;
        this._success = success;
    }

    get user() {
        return this._user;
    }

    get token() {
        return this._token;
    }

    get success() {
        return this._success;
    }

    get message() {
        return this._message;
    }

    static fromJson(json: AuthenticateResponse): AuthenticateResponse {
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
            jsonObject._message,
            jsonObject._success,
        );
    }
}