import {AuthToken} from "tweeter-shared";
import {AuthenticateService} from "../../model/AuthenticateService";
import {MessageView, Presenter} from "../Presenter";

export interface AppNavbarView extends MessageView {
    navigateTo: (url: string) => void,
    clearUserInfo: () => void,
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private _service: AuthenticateService | null = null;

    public constructor(view: AppNavbarView) {
        super(view);
    }

    public get service() {
        return this._service ? this._service : new AuthenticateService()
    }

    public async logout(authToken: AuthToken | null){
        this.view.displayInfoMessage("Logging Out...", 0);
        await this.reportFailingAction(async () => {
            await this.service.logout(authToken!);
            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
            this.view.navigateTo("/login");
        }, this.getItemDetails());
    };

    protected getItemDetails(): string {
        return 'log user out';
    }
}