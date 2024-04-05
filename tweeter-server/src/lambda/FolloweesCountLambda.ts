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
            await new UserService().getFolloweesCount(
                followCountRequest.authToken, followCountRequest.user
            );
        return new FollowCountResponse(count, message, success);
    }
    catch (error)
    {
        if(error instanceof Error)
            throw new Error(`${error.message}`);
        throw new Error(`[Internal Server Error]: ${error}`)
    }
};