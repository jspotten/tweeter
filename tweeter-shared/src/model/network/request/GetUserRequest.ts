import {AuthToken} from "../../domain/AuthToken";

export class GetUserRequest {
    public constructor(
        public authToken: AuthToken,
        public alias: string
    ){}
}