import { TweeterResponse, UnfollowRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: UnfollowRequest): Promise<TweeterResponse> => {
    let [followee_count, follower_count] = await new UserService().unfollow(event.authToken, event.userToUnfollow);
    return { _message: "", _success: true}
};