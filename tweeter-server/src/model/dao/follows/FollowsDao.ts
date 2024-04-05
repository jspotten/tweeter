import {DataPage} from "../DataPage";
import {User} from "tweeter-shared";

export interface FollowsDao {
    readonly tableName: string;
    putFollows(follower: User, followee: User): Promise<void>;
    getFollowers(followeeHandle: string): Promise<string[]>
    getFollows(user: User, selectedUser: User): Promise<boolean>;
    deleteFollows(follower: User, followee: User): Promise<void>;
    getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFollowee: User | null
    ) : Promise<DataPage<User>>;
    getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollower: User | null
    ): Promise<DataPage<User>>
}