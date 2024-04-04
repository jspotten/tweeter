import {DataPage} from "../DataPage";
import {Status} from "tweeter-shared";

export interface StoryDao {
    readonly tableName: string;
    putStatus(status: Status): Promise<void>;
    deleteStatus(status: Status): Promise<void>;
    getPageOfStoryStatuses(
        authorHandle: string,
        pageSize: number,
        lastStatus: Status | null
    ) : Promise<DataPage<Status>>;
}