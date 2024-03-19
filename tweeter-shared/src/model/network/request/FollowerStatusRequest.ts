import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";

export class FollowerStatusRequest {
    public constructor(
        public authToken: AuthToken,
        public user: User,
        public selectedUser: User
    ){}
}