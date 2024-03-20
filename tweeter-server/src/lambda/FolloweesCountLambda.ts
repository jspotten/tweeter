import {
    FollowCountRequest,
    FollowCountResponse,
} from "tweeter-shared";
import {UserService} from "../model/service/UserService";

export const handler = async (event: FollowCountRequest): Promise<FollowCountResponse> => {
    const count = await new UserService().getFolloweesCount(event.authToken, event.user);
    return new FollowCountResponse(count, "", true);
};