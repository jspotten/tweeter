import {AuthenticateResponse, LoginRequest} from "tweeter-shared";

import {UserService} from "../model/service/UserService";

export class LoginLambda {
    handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
        let [user, token] = await new UserService().login(event.username, event.password);
        return new AuthenticateResponse(user, token)
    };
}