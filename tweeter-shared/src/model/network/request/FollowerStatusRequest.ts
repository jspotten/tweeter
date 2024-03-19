import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Request} from "./Request";

export class FollowerStatusRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public user: User,
        public selectedUser: User
    ){}
}