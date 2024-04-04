import {DataPage} from "../DataPage";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {FollowsDao} from "./FollowsDao";
import {Follow} from "./Follows";

export class DdbFollowsDao implements FollowsDao {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followerHandle = "follower_handle";
    readonly followeeHandle = "followee_handle";
    readonly followerNameAttr = "follower_name";
    readonly followeeNameAttr = "followee_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async putFollows(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerHandle]: follow.follower_handle,
                [this.followeeHandle]: follow.followee_handle,
                [this.followerNameAttr]: follow.follower_name,
                [this.followeeNameAttr]: follow.followee_name,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    public async getFollowers(followeeHandle: string): Promise<string[]>
    {
        const params = {
            KeyConditionExpression: `${this.followeeHandle} = :v`,
            ExpressionAttributeValues: {
                ":v": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
        };

        const items: string[] = [];
        const data = await this.client.send(new QueryCommand(params));
        data.Items?.forEach((item) =>
            items.push(item.follower_handle)
        );
        return items;
    }

    public async getFollows(follow: Follow): Promise<Follow | undefined> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowsKeyPair(follow)
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? undefined
            : new Follow(
                output.Item[this.followerHandle],
                output.Item[this.followeeHandle],
                output.Item[this.followerNameAttr],
                output.Item[this.followeeNameAttr],
            );
    }

    public async deleteFollows(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowsKeyPair(follow),
        };
        await this.client.send(new DeleteCommand(params));
    }

    private generateFollowsKeyPair(follow: Follow)
    {
        return {
            [this.followerHandle]: follow.follower_handle,
            [this.followeeHandle]: follow.followee_handle,
        }
    }

    async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: `${this.followerHandle} = :v`,
            ExpressionAttributeValues: {
                ":v": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFolloweeHandle === undefined
                    ? undefined
                    : {
                        [this.followerHandle]: followerHandle,
                        [this.followeeHandle]: lastFolloweeHandle,
                    },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new Follow(
                    item.follower_handle,
                    item.followee_handle,
                    item.follower_name,
                    item.followee_name
                )
            )
        );
        return new DataPage<Follow>(items, hasMorePages);
    }

    async getPageOfFollowers(
        followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined
    ): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: `${this.followeeHandle} = :v`,
            ExpressionAttributeValues: {
                ":v": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFollowerHandle === undefined
                    ? undefined
                    : {
                        [this.followerHandle]: lastFollowerHandle,
                        [this.followeeHandle]: followeeHandle,
                    },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new Follow(
                    item.follower_handle,
                    item.followee_handle,
                    item.follower_name,
                    item.followee_name
                )
            )
        );
        return new DataPage<Follow>(items, hasMorePages);
    }
}