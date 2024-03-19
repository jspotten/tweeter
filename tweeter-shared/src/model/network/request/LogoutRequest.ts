import {AuthToken} from "../../domain/AuthToken";

export class LogoutRequest {
    public constructor(public authToken: AuthToken){}
}