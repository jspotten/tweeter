import {FeedDao} from "./FeedDao";
import {FeedStatus} from "./FeedStatus";
import {DataPage} from "../follows/DataPage";
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {Status, User} from "tweeter-shared";

export class DdbFeedDao implements FeedDao {
    readonly tableName: string = 'feed';
    readonly owner_handle = 'owner_handle';
    readonly timestamp = 'timestamp';
    readonly author_handle = 'author_handle';
    readonly status = 'status';

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async deleteStatus(status: FeedStatus): Promise<void> {
        return Promise.resolve(undefined);
    }

    public async getPageOfFeedStatuses(followerHandle: string, pageSize: number, lastStatus: string | undefined): Promise<DataPage<Status>> {
        const params = {
            KeyConditionExpression: `${this.owner_handle} = :v`,
            ExpressionAttributeValues: {
                ":v": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastStatus === undefined
                    ? undefined
                    : {
                        [this.owner_handle]: followerHandle,
                        [this.status]: lastStatus,
                    },
        };

        const items: Status[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new Status(
                    item.status,
                    new User("", "", item.author_handle, "") ,
                    item.status,
                )
            )
        );
        return new DataPage<Status>(items, hasMorePages);
    }

    public async putStatus(status: FeedStatus): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.owner_handle]: status.followerHandle,
                [this.timestamp]: status.timeStamp,
                [this.author_handle]: status.authorHandle,
                [this.status]: status.status,
            }
        }
        await this.client.send(new PutCommand(params));
    }

}