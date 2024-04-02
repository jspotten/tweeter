import {StoryDao} from "./StoryDao";
import {StoryStatus} from "./StoryStatus";
import {DataPage} from "../follows/DataPage";

export class DdbStoryDao implements StoryDao{
    readonly tableName: string = 'story';

    deleteStatus(status: StoryStatus): Promise<void> {
        return Promise.resolve(undefined);
    }

    getPageOfStoryStatuses(ownerHandle: string, pageSize: number, lastStatus: string | undefined): Promise<DataPage<StoryStatus>> {
        return Promise.resolve(undefined);
    }

    putStatus(status: StoryStatus): Promise<void> {
        return Promise.resolve(undefined);
    }

}