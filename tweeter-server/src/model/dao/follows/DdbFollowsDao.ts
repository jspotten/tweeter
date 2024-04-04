import {DataPage} from "../DataPage";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {FollowsDao} from "./FollowsDao";
import {User} from "tweeter-shared";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";


export class DdbFollowsDao implements FollowsDao {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followerHandle = "follower_handle";
    readonly followeeHandle = "followee_handle";
    readonly followerUser = "follower_user";
    readonly followeeUser = "followee_user";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async putFollows(follower: User, followee: User): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerHandle]: follower.alias,
                [this.followeeHandle]: followee.alias,
                [this.followerUser]: follower,
                [this.followeeUser]: followee,
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

    public async getFollows(user: User, selectedUser: User): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerHandle]: user.alias,
                [this.followeeHandle]: selectedUser.alias,
            }
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
    }

    public async deleteFollows(follower: User, followee: User): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerHandle]: follower.alias,
                [this.followeeHandle]: followee.alias,
            }
        };
        await this.client.send(new DeleteCommand(params));
    }

    async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<User>> {
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

        const items: User[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            {
                let user = User.fromJson(item.followee_user)
                if(user)
                {
                    items.push(user)
                }
            }
        );
        return new DataPage<User>(items, hasMorePages);
    }

    async getPageOfFollowers(
        followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined
    ): Promise<DataPage<User>> {
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

        const items: User[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            {
                let user = User.fromJson(item.follower_user)
                if(user)
                {
                    items.push(user)
                }
            }
        );
        return new DataPage<User>(items, hasMorePages);
    }
}