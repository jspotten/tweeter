import { LogoutRequest, TweeterResponse} from "tweeter-shared";
import {AuthenticateService} from "../model/service/AuthenticateService";

export const handler = async (event: LogoutRequest): Promise<TweeterResponse> => {
    await new AuthenticateService().logout(event.authToken);
    return { _message: "", _success: true}
};