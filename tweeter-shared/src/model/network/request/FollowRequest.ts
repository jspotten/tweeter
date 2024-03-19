import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";

export class FollowRequest {
    public constructor(
        public authToken: AuthToken,
        public userToFollow: User
    ){}
}