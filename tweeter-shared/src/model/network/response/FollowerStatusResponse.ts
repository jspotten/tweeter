import {TweeterResponse} from "./Response";

export class FollowerStatusResponse implements TweeterResponse{
    public constructor(
        private readonly _isFollowing: boolean,
        readonly _message: string,
        readonly _success: boolean
    ){}

    public get isFollowing() {
        return this._isFollowing;
    }

    public get message() {
        return this._message;
    }

    public get success() {
        return this._success;
    }
}