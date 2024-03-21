import {
    PostStatusRequest,
    TweeterResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: PostStatusRequest): Promise<TweeterResponse> => {
    try {
        if(!event.authToken || !event.newStatus)
        {
            throw new Error("[Bad Request]");
        }

        const [ message, success] =
            await new StatusService().postStatus(event.authToken, event.newStatus);
        return { _message: message, _success: success }
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};