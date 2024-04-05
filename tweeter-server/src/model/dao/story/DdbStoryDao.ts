import {StoryDao} from "./StoryDao";
import {DataPage} from "../DataPage";
import {Status} from "tweeter-shared";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";


export class DdbStoryDao implements StoryDao {
    readonly tableName: string = 'story';
    readonly author_handle = 'author_handle';
    readonly timestamp = 'timestamp';
    readonly status = 'status';

    readonly marshallOptions = {
        // Whether to automatically convert empty strings, blobs, and sets to `null`.
        convertEmptyValues: false, // false, by default.
        // Whether to remove undefined values while marshalling.
        removeUndefinedValues: true, // false, by default.
        // Whether to convert typeof object to map attribute.
        convertClassInstanceToMap: false, // false, by default.
    };
    readonly unmarshallOptions = {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: false, // false, by default.
    };

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient(), {
        marshallOptions: this.marshallOptions,
        unmarshallOptions: this.unmarshallOptions,
    });

    public async deleteStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.author_handle]: status.user.alias,
                [this.timestamp]: status.timestamp,
            }
        };
        await this.client.send(new DeleteCommand(params));
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
        const data = await this.client.send(new QueryCommand(params));
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
        await this.client.send(new PutCommand(params));
    }
}