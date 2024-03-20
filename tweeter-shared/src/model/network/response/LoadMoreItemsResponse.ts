import {TweeterResponse} from "./Response";

export class LoadMoreItemsResponse<T> implements TweeterResponse {
    public constructor(
        private readonly _items: T[],
        private readonly _bool: boolean,
        readonly _message: string,
        readonly _success: boolean,
    ) {}

    public get items() {
        return this._items;
    }

    public get bool() {
        return this._bool;
    }

    public get message() {
        return this._message;
    }

    public get success() {
        return this._success;
    }
}