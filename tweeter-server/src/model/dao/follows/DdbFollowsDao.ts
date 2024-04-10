import {DataPage} from "../DataPage";
import {FollowsDao} from "./FollowsDao";
import {User} from "tweeter-shared";
import {DdbDao} from "../DdbDao";
import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";


export class DdbFollowsDao extends DdbDao implements FollowsDao{
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followerHandle = "follower_handle";
    readonly followeeHandle = "followee_handle";
    readonly followerUser = "follower_user";
    readonly followeeUser = "followee_user";

    public async putFollows(follower: User, followee: User): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerHandle]: follower.alias,
                [this.followeeHandle]: followee.alias,
                [this.followerUser]: JSON.stringify(follower),
                [this.followeeUser]: JSON.stringify(followee),
            },
        };
        await this.getClient().send(new PutCommand(params));
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
        const data = await this.getClient().send(new QueryCommand(params));
        data.Items?.forEach((item) =>
            items.push(item[this.followerHandle])
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
        const output = await this.getClient().send(new GetCommand(params));
        return output.Item !== undefined
    }

    public async deleteFollows(follower: User, followee: User): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerHandle]: follower.alias,
                [this.followeeHandle]: followee.alias,
            }
        };
        await this.getClient().send(new DeleteCommand(params));
    }

    public async getPageOfFollowees(followerHandle: string, pageSize: number, lastFollowee: User | null): Promise<DataPage<User>> {
        const params = {
            KeyConditionExpression: `${this.followerHandle} = :v`,
            ExpressionAttributeValues: {
                ":v": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFollowee === null
                    ? undefined
                    : {
                        [this.followerHandle]: followerHandle,
                        [this.followeeHandle]: lastFollowee.alias,
                    },
        };

        const items: User[] = [];
        const data = await this.getClient().send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) => {
                let user = User.fromJson(item.followee_user)
                if(user)
                {
                    items.push(user)
                }
            }
        );
        return new DataPage<User>(items, hasMorePages);
    }

    public async getPageOfFollowers(
        followeeHandle: string, pageSize: number, lastFollower: User | null
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
                lastFollower === null
                    ? undefined
                    : {
                        [this.followerHandle]: lastFollower.alias,
                        [this.followeeHandle]: followeeHandle
                    },
        };

        const items: User[] = [];
        const data = await this.getClient().send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) => {
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