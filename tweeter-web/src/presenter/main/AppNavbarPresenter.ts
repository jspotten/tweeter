import {AuthToken} from "tweeter-shared";
import {AuthenticateService} from "../../model/AuthenticateService";
import {MessageView, Presenter} from "../Presenter";

export interface AppNavbarView extends MessageView {
    authToken: AuthToken | null,
    navigateTo: (url: string) => void,
    clearUserInfo: () => void,
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private service: AuthenticateService;

    public constructor(view: AppNavbarView) {
        super(view);
        this.service = new AuthenticateService();
    }

    public async logOut(){
        this.view.displayInfoMessage("Logging Out...", 0);
        await this.reportFailingAction(async () => {
            await this.service.logout(this.view.authToken!);
            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
            this.view.navigateTo("/login");
        }, 'log user out');
    };
}