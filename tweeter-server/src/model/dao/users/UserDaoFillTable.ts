import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { hashSync } from 'bcryptjs';
import { execSync } from "child_process";
import {DdbDao} from "../DdbDao";
import {User} from "tweeter-shared";

export class UserDaoFillTable extends DdbDao{
    private TABLE_NAME = 'users';
    private PRIMARY_KEY = "handle";
    private FIRST_NAME = "first_name";
    private LAST_NAME = "last_name";
    private PASSWORD = "password";
    private IMAGE_URL = "img_url";
    private FOLLOWING_COUNT = 'followees_count';
    private FOLLOWERS_COUNT = 'followers_count';

    async createUsers(userList: User[], password: string){
        if(userList.length == 0){
            console.log('zero followers to batch write');
            return;
        }
        else{
            const hashedPassword = hashSync(password);
            const params = {
                RequestItems: {
                    [this.TABLE_NAME]: this.createPutUserRequestItems(userList, hashedPassword)
                }
            }
            await this.getClient().send(new BatchWriteCommand(params))
                .then(async (resp: any) => {
                    await this.putUnprocessedItems(resp, params);
                })
                .catch((err: any) => {
                    throw new Error('Error while batchwriting users with params: '+ params + ": \n" + err);
                });;
        }
    }
    private createPutUserRequestItems(userList: User[], hashedPassword: string){
        return userList.map(user => this.createPutUserRequest(user, hashedPassword));
    }
    private createPutUserRequest(user: User, hashedPassword: string){
        let item = {
            [this.PRIMARY_KEY]: user.alias,
            [this.FIRST_NAME]: user.firstName,
            [this.LAST_NAME]: user.lastName,
            [this.PASSWORD]: hashedPassword,
            [this.IMAGE_URL]: user.imageUrl,
            [this.FOLLOWERS_COUNT]: 0,
            [this.FOLLOWING_COUNT]: 1
        }
        let request = {
            PutRequest: {
                Item: item
            }
        }
        return request;
    }

    private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput){
        if(resp.UnprocessedItems != undefined){
            let sec = 0.01;
            while(Object.keys(resp.UnprocessedItems).length > 0) {
                console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
                //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
                // @ts-ignore
                params.RequestItems = resp.UnprocessedItems;
                execSync('sleep ' + sec);
                if(sec < 1) sec += 0.1;
                await this.getClient().send(new BatchWriteCommand(params));
                if(resp.UnprocessedItems == undefined){
                    break;
                }
            }
        }
    }
    increaseFollowersCount(alias: string, count: number){
        const params = {
            TableName: this.TABLE_NAME,
            Key: { [this.PRIMARY_KEY]: alias},
            ExpressionAttributeValues: { ":inc": count },
            UpdateExpression: "SET " + this.FOLLOWERS_COUNT + " = " + this.FOLLOWERS_COUNT + ' + :inc'
        };
        this.getClient().send(new UpdateCommand(params)).then((data: any) => {
            return true});
    }
}