import {
    FollowCountRequest,
    FollowCountResponse,
} from "tweeter-shared";
import {UserService} from "../model/service/UserService";

export const handler = async (event: FollowCountRequest): Promise<FollowCountResponse> => {
    try {
        if(!event.authToken || !event.user)
        {
            throw new Error("[Bad Request]");
        }

        const [ count, message, success] = await new UserService().getFolloweesCount(event.authToken, event.user);
        return new FollowCountResponse(count, message, success);
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};