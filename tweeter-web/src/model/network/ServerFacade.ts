import {
    AuthenticateResponse,
    LoadMoreItemsResponse,
    TweeterResponse,
    GetUserResponse,
    FollowCountRequest,
    FollowCountResponse,
    FollowerStatusRequest,
    GetUserRequest,
    LoadMoreItemsRequest,
    LoginRequest,
    LogoutRequest,
    PostStatusRequest,
    RegisterRequest,
    Status,
    User, FollowerStatusResponse,
} from "tweeter-shared"
import {ClientCommunicator} from "./ClientCommunicator";

export class ServerFacade {

    private SERVER_URL: string = "TODO: Set this value.";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    async login(request: LoginRequest): Promise<AuthenticateResponse> {
        const endpoint: string = "/tweeter/login";
        return await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint)
    }

    async logout(request: LogoutRequest): Promise<TweeterResponse> {
        const endpoint: string = "/tweeter/logout";
        return await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(request, endpoint);
    }

    async register(request: RegisterRequest): Promise<AuthenticateResponse> {
        const endpoint: string = "/tweeter/register";
        return await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
    }

    async loadMoreFeedItems<T extends Status>(request: LoadMoreItemsRequest<T>): Promise<LoadMoreItemsResponse<T>> {
        return await this.loadMoreItems(request, "/tweeter/feed");
    }

    async loadMoreStoryItems<T extends Status>(request: LoadMoreItemsRequest<T>): Promise<LoadMoreItemsResponse<T>> {
        return await this.loadMoreItems(request, "/tweeter/story");
    }

    async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
        const endpoint: string = "/tweeter/post-status";
        return await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);
    }

    async getUser(request: GetUserRequest): Promise<GetUserResponse> {
        const endpoint: string = "/tweeter/user";
        return await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, endpoint);
    }

    async loadMoreFollowers<T extends User>(request: LoadMoreItemsRequest<T>): Promise<LoadMoreItemsResponse<T>> {
        return await this.loadMoreItems(request, "/tweeter/followers");
    }

    async loadMoreFollowees<T extends User>(request: LoadMoreItemsRequest<T>): Promise<LoadMoreItemsResponse<T>> {
        return this.loadMoreItems(request, "/tweeter/followees");
    }

    async loadMoreItems<T extends Status | User>(request: LoadMoreItemsRequest<T>, endpoint: string): Promise<LoadMoreItemsResponse<T>> {
        return await this.clientCommunicator.doPost<LoadMoreItemsRequest<T>, LoadMoreItemsResponse<T>>(request, endpoint);
    }

    async getFollowersCount(request: FollowCountRequest): Promise<FollowCountResponse> {
        return this.getFollowCount(request, "/tweeter/followers-count")
    }

    async getFolloweesCount(request: FollowCountRequest): Promise<FollowCountResponse> {
        return this.getFollowCount(request, "/tweeter/followees-count")
    }

    async getFollowCount(request: FollowCountRequest, endpoint: string): Promise<FollowCountResponse> {
        return await this.clientCommunicator.doPost<FollowCountRequest, FollowCountResponse>(request, endpoint);
    }

    async getIsFollowerStatus(request: FollowerStatusRequest): Promise<FollowerStatusResponse> {
        const endpoint: string = "/tweeter/follower-status";
        return await this.clientCommunicator.doPost<FollowerStatusRequest, FollowerStatusResponse>(request, endpoint);
    }
}