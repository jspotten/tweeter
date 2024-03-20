import {
    AuthToken,
    LoadMoreItemsRequest,
    PostStatusRequest,
    Status,
    User
} from "tweeter-shared"
import {ServerFacade} from "../network/ServerFacade";

export class StatusService {
    protected facade = new ServerFacade();

    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const loadMoreItemsRequest = new LoadMoreItemsRequest(
            authToken,
            user,
            pageSize,
            lastItem,
        )
        const loadFeedItemsResponse =
            await this.facade.loadMoreFeedItems<Status>(loadMoreItemsRequest)

        return [loadFeedItemsResponse.items, loadFeedItemsResponse.bool]
    };

    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const loadMoreItemsRequest = new LoadMoreItemsRequest(
            authToken,
            user,
            pageSize,
            lastItem,
        )
        const loadStoryItemsResponse =
            await this.facade.loadMoreStoryItems<Status>(loadMoreItemsRequest)

        return [loadStoryItemsResponse.items, loadStoryItemsResponse.bool]
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        const postStatusRequest = new PostStatusRequest(authToken, newStatus);
        const postStatusResponse = await this.facade.postStatus(postStatusRequest)
    };
}