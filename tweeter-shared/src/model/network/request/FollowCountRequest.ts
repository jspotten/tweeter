import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {CountRequest} from "./Request";

export class FollowCountRequest implements CountRequest{
    public constructor(
        public authToken: AuthToken,
        public user: User
    ){}
}