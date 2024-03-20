import {
    AuthenticateResponse,
    LoadMoreItemsResponse,
    TweeterResponse,
    FollowCountRequest,
    FollowerStatusRequest,
    FollowRequest,
    GetUserRequest,
    LoadMoreItemsRequest,
    LoginRequest,
    LogoutRequest,
    PostStatusRequest,
    RegisterRequest,
    Status,
    UnfollowRequest,
    User,
} from "tweeter-shared"
import {ClientCommunicator} from "./ClientCommunicator";

export class ServerFacade {

    private SERVER_URL = "TODO: Set this value.";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    async login(request: LoginRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/login";
        return await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint)
    }

    async logout(request: LogoutRequest): Promise<TweeterResponse> {
        const endpoint = "/service/logout";
        return await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(request, endpoint);
    }

    async register(request: RegisterRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/register";
        return await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
    }

    async loadMoreFeedItems<T extends Status | User>(request: LoadMoreItemsRequest<T>): Promise<LoadMoreItemsResponse<T>> {
        const endpoint = "/service/load-feed-items";
        return await this.clientCommunicator.doPost<LoadMoreItemsRequest<T>, LoadMoreItemsResponse<T>>(request, endpoint);
    }

    async loadMoreStoryItems<T extends Status | User>(request: LoadMoreItemsRequest<T>): Promise<LoadMoreItemsResponse<T>> {
        const endpoint = "/service/load-story-items";
        return await this.clientCommunicator.doPost<LoadMoreItemsRequest<T>, LoadMoreItemsResponse<T>>(request, endpoint);
    }

    async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
        const endpoint = "/service/post-status";
        return await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);
    }

    async getUser(request: GetUserRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/get-user";
        const response: JSON = await this.clientCommunicator.doPost<GetUserRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async loadMoreFollowers(request: LoadMoreItemsRequest<User>): Promise<AuthenticateResponse> {
        const endpoint = "/service/load-followers";
        const response: JSON = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async loadMoreFollowees(request: LoadMoreItemsRequest<User>): Promise<AuthenticateResponse> {
        const endpoint = "/service/load-followees";
        const response: JSON = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async follow(request: FollowRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/follow";
        const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async unfollow(request: UnfollowRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/unfollow";
        const response: JSON = await this.clientCommunicator.doPost<UnfollowRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async getFollowersCount(request: FollowCountRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/get-followers-count";
        const response: JSON = await this.clientCommunicator.doPost<FollowCountRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async getFolloweesCount(request: FollowCountRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/get-followees-count";
        const response: JSON = await this.clientCommunicator.doPost<FollowCountRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async getIsFollowerStatus(request: FollowerStatusRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/get-follower-status";
        const response: JSON = await this.clientCommunicator.doPost<FollowerStatusRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }
}