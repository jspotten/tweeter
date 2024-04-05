import {AuthToken, FakeData, User} from "tweeter-shared";
import {Service} from "./Service";

export class UserService extends Service {
    private followsDao = this.daoFactory.makeFollowsDao();
    private usersDao = this.daoFactory.makeUsersDao();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        await this.validateAuthToken(authToken)
        const [user, password, followersCount, followeesCount] =
            await this.usersDao.getUserByHandle(alias)
        return user;
    };

    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean, string, boolean]>
    {
        await this.validateAuthToken(authToken)
        const usersDataPage = await this.followsDao.getPageOfFollowers(
            user.alias,
            pageSize,
            lastItem
        )
        return [usersDataPage.values, usersDataPage.hasMorePages, "Successful Loading of More Followers", true];
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean, string, boolean]>
    {
        await this.validateAuthToken(authToken)
        const usersDataPage = await this.followsDao.getPageOfFollowees(
            user.alias,
            pageSize,
            lastItem
        )
        return [usersDataPage.values, usersDataPage.hasMorePages, "Successful Loading of More Followers", true];
    };

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[string, boolean]> {
        await this.validateAuthToken(authToken)

        const user = await this.authTokenDao.getTokenUser(authToken.token)
        if(!user)
        {
            return ["AuthToken missing associated user!", false]
        }

        await this.followsDao.putFollows(user, userToFollow);
        await this.usersDao.updateUserFollowerCount(userToFollow.alias, 1)
        await this.usersDao.updateUserFolloweeCount(user.alias, 1)

        return [`Successful Following of ${userToFollow.alias}` , true];
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[string, boolean]> {
        await this.validateAuthToken(authToken)

        const user = await this.authTokenDao.getTokenUser(authToken.token)
        if(!user)
        {
            return ["AuthToken missing associated user!", false]
        }

        await this.followsDao.deleteFollows(user, userToUnfollow);
        await this.usersDao.updateUserFollowerCount(userToUnfollow.alias, -1)
        await this.usersDao.updateUserFolloweeCount(user.alias, -1)

        return [`Successful Following of ${userToUnfollow.alias}` , true];
    };

    public async getFollowersCount(
        authToken: AuthToken,
        user: User
    ): Promise<[number, string, boolean]> {
        await this.validateAuthToken(authToken)

        const [ _user, _, followersCount, followeesCount] =
            await this.usersDao.getUserByHandle(user.alias)
        return [followersCount, "Successful Followers Count Retrieval", true];
    };

    public async getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<[number, string, boolean]> {
        await this.validateAuthToken(authToken)

        const [ _user, _, followersCount, followeesCount] =
            await this.usersDao.getUserByHandle(user.alias)
        return [followeesCount, "Successful Followees Count Retrieval", true];
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<[boolean, string, boolean]> {
        await this.validateAuthToken(authToken)
        const isFollower = await this.followsDao.getFollows(user, selectedUser);
        return [isFollower, "Successful Retrieval of Follow Status", true];
    };
}