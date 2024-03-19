import {
    AuthenticateResponse,
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
import {TweeterResponse} from "tweeter-shared/dist/model/network/response/Response";

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
        const response: JSON = await this.clientCommunicator.doPost<RegisterRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async loadMoreFeedItems(request: LoadMoreItemsRequest<Status>): Promise<AuthenticateResponse> {
        const endpoint = "/service/load-feed-items";
        const response: JSON = await this.clientCommunicator.doPost<LoadMoreItemsRequest<Status>>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async loadMoreStoryItems(request: LoadMoreItemsRequest<Status>): Promise<AuthenticateResponse> {
        const endpoint = "/service/load-story-items";
        const response: JSON = await this.clientCommunicator.doPost<LoadMoreItemsRequest<Status>>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }

    async postStatus(request: PostStatusRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/post-status";
        const response: JSON = await this.clientCommunicator.doPost<PostStatusRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
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