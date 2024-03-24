import {
    LoadMoreUsersResponse,
    LoadMoreUsersRequest,
} from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: LoadMoreUsersRequest): Promise<LoadMoreUsersResponse> => {
    try {
        const request = LoadMoreUsersRequest.fromJson(event);

        if(!request.authToken || !request.user || !request.pageSize)
        {
            throw new Error("[Bad Request]");
        }

        const [users, hasMoreItems, message, success] =
            await new UserService().loadMoreFollowees(request.authToken, request.user, request.pageSize, request.lastItem);
        return new LoadMoreUsersResponse(users, hasMoreItems, message, success);
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};