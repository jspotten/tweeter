import { AuthToken } from "../../domain/AuthToken";
import { Request} from "./Request";

export class LogoutRequest implements Request{
    public constructor(public authToken: AuthToken){}
}