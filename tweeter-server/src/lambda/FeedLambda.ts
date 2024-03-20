import {
    LoadMoreItemsRequest,
    LoadMoreItemsResponse,
    Status,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: LoadMoreItemsRequest<Status>): Promise<LoadMoreItemsResponse<Status>> => {
    let [statuses, bool] =
        await new StatusService().loadMoreFeedItems(event.authToken, event.user, event.pageSize, event.lastItem);
    return new LoadMoreItemsResponse<Status>(statuses, bool, "", true);
};