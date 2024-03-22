import {LoadMoreItemsResponse, ResponseJson} from "./LoadMoreItemsResponse";
import {Status} from "../../domain/Status";

export class LoadMoreStatusesResponse extends LoadMoreItemsResponse<Status> {
    public constructor(
        items: Status[],
        hasMoreItems: boolean,
        message: string,
        success: boolean)
    {
        super(items, hasMoreItems, message, success);
    }

    static fromJson(json: LoadMoreItemsResponse<Status>): LoadMoreStatusesResponse
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
            throw new Error("LoadMoreStatusesResponse, could not deserialize items with json");
        }

        const deserializedHasMoreItems: boolean = JSON.parse(JSON.stringify(jsonObject._hasMoreItems));
        if (deserializedHasMoreItems === null) {
            throw new Error("LoadMoreStatusesResponse, could not deserialize _hasMoreItems with json");
        }

        return new LoadMoreStatusesResponse(
            deserializedItems,
            deserializedHasMoreItems,
            jsonObject._message,
            jsonObject._success,
        );
    }
}