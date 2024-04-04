import {AuthToken} from "../../domain/AuthToken";
import {Status} from "../../domain/Status";
import {Request} from "./Request";


export class PostStatusRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public newStatus: Status
    ){}

    static fromJson(request: PostStatusRequest): PostStatusRequest
    {
        const deserializedToken = AuthToken.fromJson(JSON.stringify(request.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(request.authToken)
            );
        }

        const deserializedNewStatus = Status.fromJson(JSON.stringify(request.newStatus))
        if (deserializedNewStatus === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize newStatus with json:\n" +
                JSON.stringify(request.newStatus)
            );
        }

        return new PostStatusRequest(
            deserializedToken,
            deserializedNewStatus
        );
    }
}