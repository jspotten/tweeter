import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Request} from "./Request";

export class UnfollowRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public userToUnfollow: User
    ){}
}