import {AuthToken} from "../../domain/AuthToken";
import {Status} from "../../domain/Status";
import {Request} from "./Request";

interface PostStatusRequestJson {
    _authToken: JSON;
    _newStatus: JSON;
}

export class PostStatusRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public newStatus: Status
    ){}

    static fromJson(request: PostStatusRequest): PostStatusRequest
    {
        const jsonObject: PostStatusRequestJson =
            request as unknown as PostStatusRequestJson;

        const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken))
        if (deserializedToken === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(jsonObject._authToken)
            );
        }

        const deserializedNewStatus = Status.fromJson(JSON.stringify(jsonObject._newStatus))
        if (deserializedNewStatus === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize newStatus with json:\n" +
                JSON.stringify(jsonObject._newStatus)
            );
        }

        return new PostStatusRequest(
            deserializedToken,
            deserializedNewStatus
        );
    }
}