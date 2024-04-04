import {FeedDao} from "./FeedDao";
import {DataPage} from "../DataPage";
import {DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {Status} from "tweeter-shared";

export class DdbFeedDao implements FeedDao {
    readonly tableName: string = 'feed';
    readonly owner_handle = 'owner_handle';
    readonly timestamp = 'timestamp';
    readonly status = 'status';

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async deleteStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.owner_handle]: status.user.alias,
                [this.timestamp]: status.timestamp,
            }
        };
        await this.client.send(new DeleteCommand(params));
    }

    public async getPageOfFeedStatuses(followerHandle: string, pageSize: number, lastStatus: Status | null): Promise<DataPage<Status>> {
        const params = {
            KeyConditionExpression: `${this.owner_handle} = :v`,
            ExpressionAttributeValues: {
                ":v": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastStatus === null
                    ? undefined
                    : {
                        [this.owner_handle]: followerHandle,
                        [this.timestamp]: lastStatus.timestamp,
                    },
        };

        const items: Status[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        // Store the entire user in the table instead of just the handle.
        data.Items?.forEach((item) =>
            items.push(item.status)
        );
        return new DataPage<Status>(items, hasMorePages);
    }

    public async putStatus(owner_handle: string, status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.owner_handle]: owner_handle,
                [this.timestamp]: status.timestamp,
                [this.status]: status,
            }
        }
        await this.client.send(new PutCommand(params));
    }

}