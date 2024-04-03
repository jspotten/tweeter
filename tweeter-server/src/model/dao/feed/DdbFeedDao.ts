import {FeedDao} from "./FeedDao";
import {FeedStatus} from "./FeedStatus";
import {DataPage} from "../follows/DataPage";

export class DdbFeedDao implements FeedDao{
    readonly tableName: string = 'feed'

    deleteStatus(status: FeedStatus): Promise<void> {
        return Promise.resolve(undefined);
    }

    getPageOfFeedStatuses(followerHandle: string, pageSize: number, lastStatus: string | undefined): Promise<DataPage<FeedStatus> | undefined> {
        return Promise.resolve(undefined);
    }

    putStatus(status: FeedStatus): Promise<void> {
        return Promise.resolve(undefined);
    }

}