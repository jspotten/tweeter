import { LogoutRequest, TweeterResponse} from "tweeter-shared";
import {AuthenticateService} from "../model/service/AuthenticateService";

export const handler = async (event: LogoutRequest): Promise<TweeterResponse> => {
    try {
        if(!event.authToken)
        {
            throw new Error("[Bad Request]");
        }

        const [ message, success] = await new AuthenticateService().logout(event.authToken);
        return { _message: message, _success: success}
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};