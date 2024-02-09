import {Toast} from "../components/toaster/Toast";

export interface ToastView {
    toastList: Toast[],
    deleteToast: (id: string) => void,
}

export class ToastPresenter {
    private view: ToastView;

    public constructor(view: ToastView)
    {
        this.view = view;
    }

    public deleteExpiredToasts()
    {
        let now = Date.now();

        for (let toast of this.view.toastList) {
            if (
                toast.expirationMillisecond > 0 &&
                toast.expirationMillisecond < now
            ) {
                this.view.deleteToast(toast.id);
            }
        }
    };
}