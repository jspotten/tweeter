import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
    const [ isFollowing, message, success] = await new UserService().getIsFollowerStatus(event.authToken, event.user, event.selectedUser);
    return new FollowerStatusResponse(isFollowing, message, success);
};