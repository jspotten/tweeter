import { Status } from "tweeter-shared"
import {UserService} from "../model/service/UserService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import {UpdateFeedLambdaRequest} from "../model/UpdateFeedLambdaRequest";

export const handler = async (event: any) => {
    for(let i = 0; i < event.Records.length; i++)
    {
        const { body } = event.Records[i];
        const status: Status | null = Status.fromJson(body);
        if(status)
        {
            let followerAliases = await new UserService().getUserFollowers(status.user.alias)
            const numberBatches = Math.ceil(followerAliases.length / 200.0)
            for(let i = 0; i < numberBatches; i++)
            {
                await sendMessage(followerAliases.splice(0, 200), status)
            }
        }
    }
}

async function sendMessage(aliases: string[], status: Status): Promise<void> {
    let sqsClient = new SQSClient();
    const sqs_url = "https://sqs.us-west-2.amazonaws.com/972160817952/tweeter-update-feed";

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