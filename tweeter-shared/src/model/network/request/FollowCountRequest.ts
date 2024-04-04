import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {CountRequest} from "./Request";

export class FollowCountRequest implements CountRequest{
    public constructor(
        public authToken: AuthToken,
        public user: User
    ){}

    static fromJson(request: FollowCountRequest): FollowCountRequest
    {
        const deserializedToken = AuthToken.fromJson(JSON.stringify(request.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(request.authToken)
            );
        }

        const deserializedUser = User.fromJson(JSON.stringify(request.user))
        if (deserializedUser === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize newStatus with json:\n" +
                JSON.stringify(request.user)
            );
        }

        return new FollowCountRequest(
            deserializedToken,
            deserializedUser
        );
    }
}