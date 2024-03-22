import {TweeterResponse} from "./Response";

export interface ResponseJson {
    _success: boolean;
    _message: string;
}

export abstract class LoadMoreItemsResponse<U> implements TweeterResponse {
    protected constructor(
        private readonly _items: U[],
        private readonly _hasMoreItems: boolean,
        readonly _message: string,
        readonly _success: boolean,
    ) {}

    public get items() {

        return this._items;
    }

    public get bool() {
        return this._hasMoreItems;
    }

    public get message() {
        return this._message;
    }

    public get success() {
        return this._success;
    }
}