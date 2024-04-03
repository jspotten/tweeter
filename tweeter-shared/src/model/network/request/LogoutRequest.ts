import { AuthToken } from "../../domain/AuthToken";
import { Request} from "./Request";


export class LogoutRequest implements Request{
    public constructor(public authToken: AuthToken){}

    static fromJson(request: LogoutRequest): LogoutRequest
    {
        const deserializedToken = AuthToken.fromJson(JSON.stringify(request.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "LogoutRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(request.authToken)
            );
        }

        return new LogoutRequest(
            deserializedToken,
        );
    }
}