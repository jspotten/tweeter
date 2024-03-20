import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: FollowRequest): Promise<TweeterResponse> => {
    let [ message, success] = await new UserService().follow(event.authToken, event.userToFollow);
    return { _message: message, _success: success}
};