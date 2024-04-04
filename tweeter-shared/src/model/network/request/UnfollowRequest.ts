import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Request} from "./Request";

export class UnfollowRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public userToUnfollow: User
    ){}

    static fromJson(request: UnfollowRequest): UnfollowRequest
    {
        const deserializedToken = AuthToken.fromJson(JSON.stringify(request.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(request.authToken)
            );
        }

        const deserializedUserToUnfollow = User.fromJson(JSON.stringify(request.userToUnfollow))
        if (deserializedUserToUnfollow === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize newStatus with json:\n" +
                JSON.stringify(request.userToUnfollow)
            );
        }

        return new UnfollowRequest(
            deserializedToken,
            deserializedUserToUnfollow
        );
    }
}