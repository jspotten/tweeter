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

        const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken))
        if (deserializedToken === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize authToken with json:\n" +
                JSON.stringify(jsonObject._authToken)
            );
        }

        const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user))
        if (deserializedUser === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize user with json:\n" +
                JSON.stringify(jsonObject._user)
            );
        }

        const deserializedLastItem = Status.fromJson(JSON.stringify(jsonObject._lastItem))
        if (deserializedLastItem === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize lastItem with json:\n" +
                JSON.stringify(jsonObject._lastItem)
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