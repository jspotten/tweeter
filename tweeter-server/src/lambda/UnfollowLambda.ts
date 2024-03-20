import { TweeterResponse, UnfollowRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: UnfollowRequest): Promise<TweeterResponse> => {
    let [ message, success] = await new UserService().unfollow(event.authToken, event.userToUnfollow);
    return { _message: message, _success: success }
};