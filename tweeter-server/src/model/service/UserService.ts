import {AuthToken, FakeData, User} from "tweeter-shared";
import {DdbDaoFactory} from "../dao/factory/DdbDaoFactory";
import {Service} from "./Service";

export class UserService extends Service {
    private daoFactory = new DdbDaoFactory();
    private followsDao = this.daoFactory.makeFollowsDao();
    private usersDao = this.daoFactory.makeUsersDao();

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
        // this.followsDao.putFollows()
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
        const [ _user, _, followersCount, followeesCount] =
            await this.usersDao.getUserByHandle(user.alias)
        return [followersCount, "Successful Followers Count Retrieval", true];
    };

    public async getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<[number, string, boolean]> {
        const [ _user, _, followersCount, followeesCount] =
            await this.usersDao.getUserByHandle(user.alias)
        return [followeesCount, "Successful Followees Count Retrieval", true];
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<[boolean, string, boolean]> {
        return [FakeData.instance.isFollower(), "Successful Retrieval of Follow Status", true];
    };
}