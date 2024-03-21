import { TweeterResponse, UnfollowRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: UnfollowRequest): Promise<TweeterResponse> => {
    try {
        if(!event.authToken || !event.userToUnfollow)
        {
            throw new Error("[Bad Request]");
        }

        const [ message, success] = await new UserService().unfollow(event.authToken, event.userToUnfollow);
        return { _message: message, _success: success }
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};