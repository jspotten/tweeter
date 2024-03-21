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
    User,
    FollowerStatusResponse,
    FollowRequest,
    UnfollowRequest,
} from "tweeter-shared"
import {ClientCommunicator} from "./ClientCommunicator";

export class ServerFacade {

    private SERVER_URL: string = "https://y8buxtepui.execute-api.us-west-2.amazonaws.com";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    async login(request: LoginRequest): Promise<AuthenticateResponse> {
        const endpoint: string = "/tweeter/login";
        const response = await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint)
        return AuthenticateResponse.fromJson(response)
    }

    async logout(request: LogoutRequest): Promise<TweeterResponse> {
        const endpoint: string = "/tweeter/logout";
        return await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(request, endpoint);
    }

    async register(request: RegisterRequest): Promise<AuthenticateResponse> {
        const endpoint: string = "/tweeter/register";
        const response = await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
        return AuthenticateResponse.fromJson(response)
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

    async follow(request: FollowRequest): Promise<TweeterResponse> {
        const endpoint: string = "/tweeter/follow";
        return await this.clientCommunicator.doPost<FollowRequest, TweeterResponse>(request, endpoint);
    }

    async unfollow(request: UnfollowRequest): Promise<TweeterResponse> {
        const endpoint: string = "/tweeter/unfollow";
        return await this.clientCommunicator.doPost<UnfollowRequest, TweeterResponse>(request, endpoint);
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