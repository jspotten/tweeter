import {AuthToken} from "../../domain/AuthToken";
import {Status} from "../../domain/Status";
import {Request} from "./Request";

export class PostStatusRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public newStatus: Status
    ){}
}