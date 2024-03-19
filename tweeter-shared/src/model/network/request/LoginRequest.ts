import {AuthenticateRequest} from "./Request";

export class LoginRequest implements AuthenticateRequest{
    public constructor(public alias: string, public password: string){}
}