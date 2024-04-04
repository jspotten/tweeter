import {DataPage} from "../DataPage";
import {Follow} from "./Follows";

export interface FollowsDao {
    readonly tableName: string;
    putFollows(follow: Follow): Promise<void>;
    getFollowers(followeeHandle: string): Promise<string[]>
    getFollows(follow: Follow): Promise<Follow | undefined>;
    updateFollows(follow: Follow): Promise<void>;
    deleteFollows(follow: Follow): Promise<void>;
    getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ) : Promise<DataPage<Follow>>;
    getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined
    ): Promise<DataPage<Follow>>
}