import {AuthenticateResponse, LoginRequest} from "tweeter-shared";
import {AuthenticateService} from "../model/service/AuthenticateService";

export const handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
    let [user, token] = await new AuthenticateService().login(event.alias, event.password);
    return new AuthenticateResponse(user, token)
};
