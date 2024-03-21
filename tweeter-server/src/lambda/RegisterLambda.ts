import {AuthenticateResponse, LoginRequest, RegisterRequest} from "tweeter-shared";
import {AuthenticateService} from "../model/service/AuthenticateService";

export const handler = async (event: RegisterRequest): Promise<AuthenticateResponse> => {
    try {
        if(!event.firstName || !event.lastName || !event.alias || !event.password || !event.imageBytes)
        {
            throw new Error("[Bad Request]")
        }
        let [user, token, message, success]
            = await new AuthenticateService().register(event.firstName, event.lastName, event.alias, event.password, event.imageBytes);
        return new AuthenticateResponse(user, token, message, success)
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`)
    }
};