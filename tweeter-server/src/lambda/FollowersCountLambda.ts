import {
    FollowCountRequest,
    FollowCountResponse,
} from "tweeter-shared";
import {UserService} from "../model/service/UserService";

export const handler = async (event: FollowCountRequest): Promise<FollowCountResponse> => {
    try {
        const followCountRequest = FollowCountRequest.fromJson(event);
        if(!followCountRequest.authToken || !followCountRequest.user)
        {
            throw new Error("[Bad Request]");
        }

        const [ count, message, success] =
            await new UserService().getFollowersCount(
                followCountRequest.authToken, followCountRequest.user
            );
        return new FollowCountResponse(count, message, success);
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};