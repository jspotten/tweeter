import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Request} from "./Request";

export class FollowRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public userToFollow: User
    ){}

    static fromJson(request: FollowRequest): FollowRequest
    {
        const deserializedToken = AuthToken.fromJson(JSON.stringify(request.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(request.authToken)
            );
        }

        const deserializedUserToFollow = User.fromJson(JSON.stringify(request.userToFollow))
        if (deserializedUserToFollow === null) {
            throw new Error(
                "PostStatusRequest, could not deserialize newStatus with json:\n" +
                JSON.stringify(request.userToFollow)
            );
        }

        return new FollowRequest(
            deserializedToken,
            deserializedUserToFollow
        );
    }
}