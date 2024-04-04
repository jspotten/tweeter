import {AuthToken, FakeData, User} from "tweeter-shared";
import {DdbDaoFactory} from "../dao/factory/DdbDaoFactory";
import {Service} from "./Service";
import {Follow} from "../dao/follows/Follows";

export class UserService extends Service {
    private daoFactory = new DdbDaoFactory();
    private followsDao = this.daoFactory.makeFollowsDao();
    private usersDao = this.daoFactory.makeUsersDao();
    private authTokenDao = this.daoFactory.makeAuthTokenDao();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            // return [0, "Authentication Token has expired!", false]
            return null
        }
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
        if(this.validateAuthToken(authToken.timestamp))
        {
            return [[], false, "Authentication Token has expired!", false]
        }

        return [...FakeData.instance.getPageOfUsers(lastItem, pageSize, user), "Successful Loading of More Followers", true];
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean, string, boolean]>
    {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return [[], false, "Authentication Token has expired!", false]
        }

        return [...FakeData.instance.getPageOfUsers(lastItem, pageSize, user), "Successful Loading of More Followees", true];
    };

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return ["Authentication Token has expired!", false]
        }

        const user = await this.authTokenDao.getTokenUser(authToken.token)
        if(!user)
        {
            return ["AuthToken missing associated user!", false]
        }

        const followRelation = new Follow(
            user.alias,
            user.firstName,
            userToFollow.alias,
            userToFollow.firstName
        )
        await this.followsDao.putFollows(followRelation);
        await this.usersDao.updateUserFollowerCount(userToFollow.alias, 1)
        await this.usersDao.updateUserFolloweeCount(user.alias, 1)

        return [`Successful Following of ${userToFollow.alias}` , true];
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return ["Authentication Token has expired!", false]
        }

        const user = await this.authTokenDao.getTokenUser(authToken.token)
        if(!user)
        {
            return ["AuthToken missing associated user!", false]
        }

        const followRelation = new Follow(
            user.alias,
            user.firstName,
            userToUnfollow.alias,
            userToUnfollow.firstName
        )
        await this.followsDao.putFollows(followRelation);
        await this.usersDao.updateUserFollowerCount(userToUnfollow.alias, -1)
        await this.usersDao.updateUserFolloweeCount(user.alias, -1)

        return [`Successful Following of ${userToUnfollow.alias}` , true];
    };

    public async getFollowersCount(
        authToken: AuthToken,
        user: User
    ): Promise<[number, string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return [0, "Authentication Token has expired!", false]
        }

        const [ _user, _, followersCount, followeesCount] =
            await this.usersDao.getUserByHandle(user.alias)
        return [followersCount, "Successful Followers Count Retrieval", true];
    };

    public async getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<[number, string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return [0, "Authentication Token has expired!", false]
        }

        const [ _user, _, followersCount, followeesCount] =
            await this.usersDao.getUserByHandle(user.alias)
        return [followeesCount, "Successful Followees Count Retrieval", true];
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<[boolean, string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return [false, "Authentication Token has expired!", false]
        }

        return [FakeData.instance.isFollower(), "Successful Retrieval of Follow Status", true];
    };
}