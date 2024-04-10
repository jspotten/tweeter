import {FeedDao} from "./FeedDao";
import {DataPage} from "../DataPage";
import {DeleteCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {Status} from "tweeter-shared";
import {DdbDao} from "../DdbDao";

export class DdbFeedDao extends DdbDao implements FeedDao {
    readonly tableName: string = 'feed';
    readonly owner_handle = 'owner_handle';
    readonly timestamp = 'timestamp';
    readonly status = 'status';

    public async deleteStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.owner_handle]: status.user.alias,
                [this.timestamp]: status.timestamp,
            }
        };
        await this.getClient().send(new DeleteCommand(params));
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
        const data = await this.getClient().send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        // Store the entire user in the table instead of just the handle.
        data.Items?.forEach((item) => {
            let status = Status.fromJson(item.status);
            if(status)
            {
                items.push(status)
            }
        }
        );
        return new DataPage<Status>(items, hasMorePages);
    }

    public async putStatus(owner_handle: string, status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.owner_handle]: owner_handle,
                [this.timestamp]: status.timestamp,
                [this.status]: JSON.stringify(status),
            }
        }
        await this.getClient().send(new PutCommand(params));
    }
}