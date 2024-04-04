import {DataPage} from "../DataPage";
import {Status} from "tweeter-shared";

export interface FeedDao {
    readonly tableName: string;
    putStatus(
        owner_handle: string,
        status: Status
    ): Promise<void>;
    deleteStatus(status: Status): Promise<void>;
    getPageOfFeedStatuses(
        ownerHandle: string,
        pageSize: number,
        lastStatus: Status | null
    ) : Promise<DataPage<Status>>;
}