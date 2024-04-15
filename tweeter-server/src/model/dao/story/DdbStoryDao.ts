import {StoryDao} from "./StoryDao";
import {DataPage} from "../DataPage";
import {Status} from "tweeter-shared";
import {
    DeleteCommand,
    PutCommand,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";
import {DdbDao} from "../DdbDao";


export class DdbStoryDao extends DdbDao implements StoryDao {
    readonly tableName: string = 'story';
    readonly author_handle = 'author_handle';
    readonly timestamp = 'timestamp';
    readonly status = 'status';

    public async deleteStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.author_handle]: status.user.alias,
                [this.timestamp]: status.timestamp,
            }
        };
        await this.getClient().send(new DeleteCommand(params));
    }

    public async getPageOfStoryStatuses(
        authorHandle: string,
        pageSize: number,
        lastStatus: Status | null
    ): Promise<DataPage<Status>> {
        const params = {
            KeyConditionExpression: `${this.author_handle} = :v`,
            ExpressionAttributeValues: {
                ":v": authorHandle,
            },
            TableName: this.tableName,
            ScanIndexForward: false,
            Limit: pageSize,
            ExclusiveStartKey:
                lastStatus === null
                    ? undefined
                    : {
                        [this.author_handle]: authorHandle,
                        [this.timestamp]: lastStatus.timestamp,
                    },
        };

        const items: Status[] = [];
        const data = await this.getClient().send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        // Store the entire user in the table instead of just the handle.
        data.Items?.forEach((item) => {
                let status = Status.fromJson(item.status);
                if(status)
                {
                    items.push(status)
                }
            });
        return new DataPage<Status>(items, hasMorePages);
    }

    public async putStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.author_handle]: status.user.alias,
                [this.timestamp]: status.timestamp,
                [this.status]: JSON.stringify(status),
            }
        }
        await this.getClient().send(new PutCommand(params));
    }
}