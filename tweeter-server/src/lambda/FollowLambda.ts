import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: FollowRequest): Promise<TweeterResponse> => {
    let [followee_count, follower_count] = await new UserService().follow(event.authToken, event.userToFollow);
    return { _message: "", _success: true}
};