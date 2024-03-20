import {AuthToken, FakeData, User} from "tweeter-shared";

export class UserService {
    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return FakeData.instance.findUserByAlias(alias);
    };

    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean, string, boolean]>
    {
        return [...FakeData.instance.getPageOfUsers(lastItem, pageSize, user), "Successful Loading of More Followers", true];
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean, string, boolean]>
    {
        return [...FakeData.instance.getPageOfUsers(lastItem, pageSize, user), "Successful Loading of More Followees", true];
    };

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[string, boolean]> {
        // Pause so we can see the following message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        return [`Successful Following of ${userToFollow}` , true];
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[string, boolean]> {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        return [`Successful Following of ${userToUnfollow}`, true];
    };

    public async getFollowersCount(
        authToken: AuthToken,
        user: User
    ): Promise<[number, string, boolean]> {
        return [await FakeData.instance.getFollowersCount(user), "Successful Followers Count Retrieval", true];
    };

    public async getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<[number, string, boolean]> {
        return [await FakeData.instance.getFollowersCount(user), "Successful Followees Count Retrieval", true];
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<[boolean, string, boolean]> {
        return [FakeData.instance.isFollower(), "Successful Retrieval of Follow Status", true];
    };
}