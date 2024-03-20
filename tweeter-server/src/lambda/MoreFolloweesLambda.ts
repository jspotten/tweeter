import {
    LoadMoreItemsRequest,
    LoadMoreItemsResponse,
    User
} from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: LoadMoreItemsRequest<User>): Promise<LoadMoreItemsResponse<User>> => {
    const [users, hasMoreItems, message, success] =
        await new UserService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem);
    return new LoadMoreItemsResponse<User>(users, hasMoreItems, message, success);
};