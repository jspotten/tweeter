export interface View {
    displayErrorMessage: (msg: string) => void,
}

export interface MessageView extends View {
    displayErrorMessage: (msg: string) => void,
    displayInfoMessage: (msg: string, code: number) => void,
    clearLastInfoMessage: () => void,
}

export abstract class Presenter<T extends View> {
    private readonly _view : T;

    protected constructor(view: T) {
        this._view = view
    }

    protected get view() : T
    {
        return this._view
    }

    protected async reportFailingAction(action: () => Promise<void>, actionDetails: string) {
        try {
            await action();
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to ${actionDetails} because of exception: ${(error as Error).message}`
            );
        }
    }
}