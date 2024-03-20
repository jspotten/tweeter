import {TweeterResponse} from "./Response";

export class FollowCountResponse implements TweeterResponse {
    public constructor(
        private readonly _count: number,
        readonly _message: string,
        readonly _success: boolean
    ){}

    public get count() {
        return this._count;
    }

    public get message() {
        return this._message;
    }

    public get success() {
        return this._success;
    }
}