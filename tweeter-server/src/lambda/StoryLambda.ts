import {
    LoadMoreItemsRequest,
    LoadMoreItemsResponse,
    Status,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: LoadMoreItemsRequest<Status>): Promise<LoadMoreItemsResponse<Status>> => {
    try {
        if(!event.authToken || !event.user || !event.pageSize || !event.lastItem)
        {
            throw new Error("[Bad Request]");
        }

        let [statuses, hasMoreItems, message, success] =
            await new StatusService().loadMoreStoryItems(event.authToken, event.user, event.pageSize, event.lastItem);
        return new LoadMoreItemsResponse<Status>(statuses, hasMoreItems, message, success);
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};