import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
    try {
        const followerStatusRequest = FollowerStatusRequest.fromJson(event);
        if(!followerStatusRequest.authToken || !followerStatusRequest.user || !followerStatusRequest.selectedUser)
        {
            throw new Error("[Bad Request]");
        }

        const [ isFollowing, message, success] =
            await new UserService().getIsFollowerStatus(
                followerStatusRequest.authToken,
                followerStatusRequest.user,
                followerStatusRequest.selectedUser
            );
        return new FollowerStatusResponse(isFollowing, message, success);
    }
    catch (error)
    {
        if(error instanceof Error)
            throw new Error(`${error.message}`);
        throw new Error(`[Internal Server Error]: ${error}`)
    }
};