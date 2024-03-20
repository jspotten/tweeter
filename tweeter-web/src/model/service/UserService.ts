import {
    AuthToken,
    FollowCountRequest,
    FollowerStatusRequest, FollowRequest,
    GetUserRequest,
    LoadMoreItemsRequest, UnfollowRequest,
    User
} from "tweeter-shared";
import {ServerFacade} from "../network/ServerFacade";

export class UserService {
    protected facade = new ServerFacade();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        const getUserRequest = new GetUserRequest(authToken, alias);
        const getUserResponse = await this.facade.getUser(getUserRequest);
        return User.fromDTO(getUserResponse.userDTO);
    };

    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]>
    {
        const loadMoreItemsRequest = new LoadMoreItemsRequest(
            authToken,
            user,
            pageSize,
            lastItem,
        );
        const loadFollowersResponse =
            await this.facade.loadMoreFollowers(loadMoreItemsRequest)
        return [loadFollowersResponse.items, loadFollowersResponse.bool]
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]>
    {
        const loadMoreItemsRequest = new LoadMoreItemsRequest(
            authToken,
            user,
            pageSize,
            lastItem,
        );
        const loadFolloweesResponse =
            await this.facade.loadMoreFollowees(loadMoreItemsRequest)
        return [loadFolloweesResponse.items, loadFolloweesResponse.bool]
    };

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        const followRequest = new FollowRequest(authToken, userToFollow);
        const followResponse = await this.facade.follow(followRequest);

        const followersCount = await this.getFollowersCount(authToken, userToFollow);
        const followeesCount = await this.getFolloweesCount(authToken, userToFollow);

        return [followersCount, followeesCount];
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        const unfollowRequest = new UnfollowRequest(authToken, userToUnfollow);
        const unfollowResponse = await this.facade.unfollow(unfollowRequest);

        const followersCount = await this.getFollowersCount(authToken, userToUnfollow);
        const followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);

        return [followersCount, followeesCount];
    };

    public async getFollowersCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        const followersCountRequest = new FollowCountRequest(authToken, user);
        const followersCountResponse
            = await this.facade.getFollowersCount(followersCountRequest)
        return followersCountResponse.count
    };

    public async getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        const followeesCountRequest = new FollowCountRequest(authToken, user);
        const followeesCountResponse
            = await this.facade.getFolloweesCount(followeesCountRequest);
        return followeesCountResponse.count;
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        const followerStatusRequest = new FollowerStatusRequest(
            authToken,
            user,
            selectedUser,
        )
        const followerStatusResponse
            = await this.facade.getIsFollowerStatus(followerStatusRequest);
        return followerStatusResponse.isFollowing;
    };
}