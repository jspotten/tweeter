import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Request} from "./Request";

export class FollowerStatusRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public user: User,
        public selectedUser: User
    ){}

    static fromJson(request: FollowerStatusRequest): FollowerStatusRequest
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
                "FollowerStatusRequest, could not deserialize user with json:\n" +
                JSON.stringify(request.user)
            );
        }

        const deserializedSelectedUser = User.fromJson(JSON.stringify(request.selectedUser))
        if (deserializedSelectedUser === null) {
            throw new Error(
                "FollowerStatusRequest, could not deserialize selectedUser with json:\n" +
                JSON.stringify(request.selectedUser)
            );
        }

        return new FollowerStatusRequest(
            deserializedToken,
            deserializedUser,
            deserializedSelectedUser,
        );
    }
}