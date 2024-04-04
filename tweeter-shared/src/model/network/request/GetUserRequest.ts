import {AuthToken} from "../../domain/AuthToken";
import {Request} from "./Request";

export class GetUserRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public alias: string
    ){}

    static fromJson(request: GetUserRequest): GetUserRequest
    {
        const deserializedToken = AuthToken.fromJson(JSON.stringify(request.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(request.authToken)
            );
        }

        return new GetUserRequest(
            deserializedToken,
            request.alias
        )
    }
}