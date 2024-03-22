import { User } from "../../domain/User";
import {LoadMoreItemsRequest, LoadMoreItemsRequestJson} from "./LoadMoreItemsRequest";
import { Status } from "../../domain/Status";
import { AuthToken } from "../../domain/AuthToken";

export class LoadMoreStatusesRequest extends LoadMoreItemsRequest<Status>{
    public constructor(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null)
    {
        super(authToken, user, pageSize, lastItem);
    }

    static fromJson(request: LoadMoreStatusesRequest): LoadMoreStatusesRequest
    {
        const jsonObject: LoadMoreItemsRequestJson =
            request as unknown as LoadMoreItemsRequestJson;

        const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "LoadMoreStatusesRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(jsonObject.authToken)
            );
        }

        const deserializedUser = User.fromJson(JSON.stringify(jsonObject.user))
        if (deserializedUser === null) {
            throw new Error(
                "LoadMoreStatusesRequest, could not deserialize user with json:\n" +
                JSON.stringify(jsonObject.user)
            );
        }
        // set default as null and if object.lastItem not null then deserialize
        const deserializedLastItem = Status.fromJson(JSON.stringify(jsonObject.lastItem))
        if (deserializedLastItem === null) {
            throw new Error(
                "LoadMoreStatusesRequest, could not deserialize lastItem with json:\n" +
                JSON.stringify(jsonObject.lastItem)
            );
        }

        return new LoadMoreStatusesRequest(
            deserializedToken,
            deserializedUser,
            request.pageSize,
            deserializedLastItem,
        );
    }
}