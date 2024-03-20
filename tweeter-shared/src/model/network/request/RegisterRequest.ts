import {AuthenticateRequest} from "./Request";

export class RegisterRequest implements AuthenticateRequest{
    public constructor(
        public firstName: string,
        public lastName: string,
        public alias: string,
        public password: string,
        public imageBytes: string
    ){}
}