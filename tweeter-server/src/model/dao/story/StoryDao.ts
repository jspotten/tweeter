import {DataPage} from "../follows/DataPage";
import {StoryStatus} from "./StoryStatus";

export interface StoryDao {
    readonly tableName: string;
    putStatus(status: StoryStatus): Promise<void>;
    deleteStatus(status: StoryStatus): Promise<void>;
    getPageOfStoryStatuses(
        ownerHandle: string,
        pageSize: number,
        lastStatus: string | undefined
    ) : Promise<DataPage<StoryStatus> | undefined>;
}