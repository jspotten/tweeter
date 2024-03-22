import {
    AuthenticateResponse,
    LoadMoreItemsResponse,
    TweeterResponse,
    GetUserResponse,
    FollowCountRequest,
    FollowCountResponse,
    FollowerStatusRequest,
    GetUserRequest,
    Request,
    LoadMoreStatusesResponse,
    LoadMoreUsersResponse,
    LoginRequest,
    LogoutRequest,
    PostStatusRequest,
    RegisterRequest,
    Status,
    User,
    FollowerStatusResponse,
    FollowRequest,
    UnfollowRequest, LoadMoreStatusesRequest, LoadMoreUsersRequest,
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

    async loadMoreFeedItems<T extends Status>(request: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> {
        const response: LoadMoreStatusesResponse
            = await this.loadMoreItems<T, LoadMoreStatusesRequest, LoadMoreStatusesResponse>(request, "/tweeter/feed");
        return LoadMoreStatusesResponse.fromJson(response)
    }

    async loadMoreStoryItems<T extends Status>(request: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> {
        const response: LoadMoreStatusesResponse
            =  await this.loadMoreItems<T, LoadMoreStatusesRequest, LoadMoreStatusesResponse>(request, "/tweeter/story");
        console.log(LoadMoreStatusesResponse.fromJson(response))
        return LoadMoreStatusesResponse.fromJson(response)
    }

    async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
        const endpoint: string = "/tweeter/post-status";
        return await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);
    }

    async getUser(request: GetUserRequest): Promise<GetUserResponse> {
        const endpoint: string = "/tweeter/user";
        return await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, endpoint);
    }

    async loadMoreFollowers<T extends User>(request: LoadMoreUsersRequest): Promise<LoadMoreUsersResponse> {
        const response: LoadMoreUsersResponse
            = await this.loadMoreItems<T, LoadMoreUsersRequest, LoadMoreUsersResponse>(request, "/tweeter/followers");
        return LoadMoreUsersResponse.fromJson(response);
    }

    async loadMoreFollowees<T extends User>(request: LoadMoreUsersRequest): Promise<LoadMoreUsersResponse> {
        const response: LoadMoreUsersResponse
            = await this.loadMoreItems<T, LoadMoreUsersRequest, LoadMoreUsersResponse>(request, "/tweeter/followees");
        return LoadMoreUsersResponse.fromJson(response);
    }

    async loadMoreItems<T extends Status | User, U extends Request, V>(request: U, endpoint: string): Promise<LoadMoreItemsResponse<T>> {
        return await this.clientCommunicator.doPost<U, LoadMoreItemsResponse<T>>(request, endpoint);
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