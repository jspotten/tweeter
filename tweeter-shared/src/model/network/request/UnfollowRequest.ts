import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";

export class UnfollowRequest {
    public constructor(
        public authToken: AuthToken,
        public userToUnfollow: User
    ){}
}