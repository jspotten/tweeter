import {LoadMoreItemsResponse, ResponseJson} from "./LoadMoreItemsResponse";
import {Status} from "../../domain/Status";

export class LoadMoreUsersResponse extends LoadMoreItemsResponse<Status, LoadMoreUsersResponse> {
    public constructor(
        items: Status[],
        hasMoreItems: boolean,
        message: string,
        success: boolean)
    {
        super(items, hasMoreItems, message, success);
    }

    public fromJson(json: LoadMoreItemsResponse<Status, LoadMoreUsersResponse>): LoadMoreUsersResponse
    {
        interface LoadMoreItemsResponseJson extends ResponseJson {
            _items: JSON[];
            _hasMoreItems: JSON;
        }

        const jsonObject: LoadMoreItemsResponseJson =
            json as unknown as LoadMoreItemsResponseJson;
        const deserializedItems: Status[] = []
        for(let item in jsonObject._items)
        {
            let itemJson = jsonObject._items[item];
            let deserializedStatus = Status.fromJson(JSON.stringify(itemJson));
            if(deserializedStatus)
                deserializedItems.push(deserializedStatus)
        }

        if (deserializedItems.length === 0) {
            throw new Error("AuthenticateResponse, could not deserialize items with json");
        }

        const deserializedHasMoreItems: boolean = JSON.parse(JSON.stringify(jsonObject._hasMoreItems));

        if (!deserializedHasMoreItems) {
            throw new Error("AuthenticateResponse, could not deserialize token with json");
        }

        return new LoadMoreUsersResponse(
            deserializedItems,
            deserializedHasMoreItems,
            jsonObject._message,
            jsonObject._success,
        );
    }
}