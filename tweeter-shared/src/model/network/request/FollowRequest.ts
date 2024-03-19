import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Request} from "./Request";

export class FollowRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public userToFollow: User
    ){}
}