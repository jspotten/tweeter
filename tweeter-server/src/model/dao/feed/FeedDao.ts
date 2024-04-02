import {DataPage} from "../follows/DataPage";
import {FeedStatus} from "./FeedStatus";

export interface FeedDao {
    readonly tableName: string;
    putStatus(status: FeedStatus): Promise<void>;
    deleteStatus(status: FeedStatus): Promise<void>;
    getPageOfFeedStatuses(
        ownerHandle: string,
        pageSize: number,
        lastStatus: string | undefined
    ) : Promise<DataPage<FeedStatus>>;
}