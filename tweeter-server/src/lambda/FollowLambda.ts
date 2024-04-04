import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: FollowRequest): Promise<TweeterResponse> => {
    try {
        const followRequest = FollowRequest.fromJson(event);
        if(!followRequest.authToken || !followRequest.userToFollow)
        {
            throw new Error("[Bad Request]");
        }

        let [ message, success] =
            await new UserService().follow(
                followRequest.authToken, followRequest.userToFollow
            );
        return { _message: message, _success: success}
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};