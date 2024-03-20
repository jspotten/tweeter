import { LogoutRequest, TweeterResponse} from "tweeter-shared";
import {AuthenticateService} from "../model/service/AuthenticateService";

export const handler = async (event: LogoutRequest): Promise<TweeterResponse> => {
    const [ message, success] = await new AuthenticateService().logout(event.authToken);
    return { _message: message, _success: success}
};