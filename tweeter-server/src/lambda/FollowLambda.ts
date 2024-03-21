import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: FollowRequest): Promise<TweeterResponse> => {
    try {
        if(!event.authToken || !event.userToFollow)
        {
            throw new Error("[Bad Request]");
        }

        let [ message, success] = await new UserService().follow(event.authToken, event.userToFollow);
        return { _message: message, _success: success}
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};