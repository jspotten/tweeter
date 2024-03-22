import {
    LoadMoreStatusesResponse,
    LoadMoreStatusesRequest
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> => {
    try {
        const request = LoadMoreStatusesRequest.fromJson(event);

        if(!request.authToken || !request.user || !request.pageSize || !request.lastItem)
        {
            throw new Error("[Bad Request]")
        }

        let [statuses, hasMoreItems, message, success] =
            await new StatusService().loadMoreFeedItems(request.authToken, request.user, request.pageSize, request.lastItem);
        return new LoadMoreStatusesResponse(statuses, hasMoreItems, message, success);
    }
    catch (error) {
        throw new Error(`[Internal Server Error]: ${error}`)
    }
};