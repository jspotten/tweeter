export class Response {
    private readonly _success: boolean;
    private readonly _message: string | null;

    constructor(success: boolean, message: string | null = null) {
        this._success = success;
        this._message = message;
    }

    get success() {
        return this._success;
    }

    get message() {
        return this._message;
    }
}

export interface TweeterResponse {
    readonly _message: string | undefined;
    readonly _success: boolean;
}