import {AuthenticateResponse, LoginRequest} from "tweeter-shared";
import {AuthenticateService} from "../model/service/AuthenticateService";

export const handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
    try {
        if(!event.alias || !event.password)
        {
            throw new Error("[Bad Request]")
        }
        let [user, token, message, success] = await new AuthenticateService().login(event.alias, event.password);
        return new AuthenticateResponse(user, token, message, success)
    }
    catch (error)
    {
        if(error instanceof Error)
            throw new Error(`${error.message}`);
        throw new Error(`[Internal Server Error]: ${error}`)
    }
};
