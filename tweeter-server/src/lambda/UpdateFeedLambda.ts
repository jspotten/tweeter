import {UpdateFeedLambdaRequest} from "../model/UpdateFeedLambdaRequest";
import {StatusService} from "../model/service/StatusService";

export const handler = async (event: any) => {
    const updateFeedLambdaRequest: UpdateFeedLambdaRequest =
        UpdateFeedLambdaRequest.fromJson(event.Records[0]);

    await new StatusService().postStatusToFeed(
        updateFeedLambdaRequest.followerAliases,
        updateFeedLambdaRequest.newStatus
    );
}