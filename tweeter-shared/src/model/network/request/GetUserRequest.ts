import {AuthToken} from "../../domain/AuthToken";
import {Request} from "./Request";

export class GetUserRequest implements Request {
    public constructor(
        public authToken: AuthToken,
        public alias: string
    ){}
}