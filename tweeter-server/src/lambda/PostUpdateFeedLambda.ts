import { Status } from "tweeter-shared"
import {UserService} from "../model/service/UserService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import {UpdateFeedLambdaRequest} from "../model/UpdateFeedLambdaRequest";

export const handler = async (event: any) => {
    for(let i = 0; event.Records.length; i++)
    {
        const status: Status | null = Status.fromJson(JSON.parse(event.Records[i].body));
        if(status)
        {
            let followerAliases = await new UserService().getUserFollowers(status.user.alias)
            for(let i = 0; i < followerAliases.length % 25; i ++)
            {
                await sendMessage(followerAliases.splice(i, i + 25), status)
            }
        }
    }
}

async function sendMessage(aliases: string[], status: Status): Promise<void> {
    let sqsClient = new SQSClient();
    const sqs_url = "https://sqs.us-west-2.amazonaws.com/972160817952/tweeter-post-status";

    const params = {
        DelaySeconds: 10,
        MessageBody: JSON.stringify(new UpdateFeedLambdaRequest(aliases, status)),
        QueueUrl: sqs_url,
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
        throw err;
    }
}