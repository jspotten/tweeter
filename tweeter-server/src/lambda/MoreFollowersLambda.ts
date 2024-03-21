import {
    LoadMoreItemsRequest,
    LoadMoreItemsResponse,
    User
} from "tweeter-shared";
import {UserService} from "../model/service/UserService";

export const handler = async (event: LoadMoreItemsRequest<User>): Promise<LoadMoreItemsResponse<User>> => {
    try {
        if(!event.authToken || !event.user || !event.pageSize || !event.lastItem)
        {
            throw new Error("[Bad Request]");
        }

        const [users, hasMoreItems, message, success] =
            await new UserService().loadMoreFollowers(event.authToken, event.user, event.pageSize, event.lastItem);
        return new LoadMoreItemsResponse<User>(users, hasMoreItems, message, success);
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};