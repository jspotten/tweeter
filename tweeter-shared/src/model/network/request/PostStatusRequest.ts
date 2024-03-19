import {AuthToken} from "../../domain/AuthToken";
import {Status} from "../../domain/Status";

export class PostStatusRequest {
    public constructor(
        public authToken: AuthToken,
        public newStatus: Status
    ){}
}