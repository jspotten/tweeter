import {AuthToken} from "tweeter-shared";
import {AuthenticateService} from "../model/AuthenticateService";

export interface AppNavbarView {
    authToken: AuthToken | null,
    navigateTo: (url: string) => void,
    displayInfoMessage: (msg: string, status: number) => void,
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,
    displayErrorMessage: (msg: string) => void,
}

export class AppNavbarPresenter {
    private view: AppNavbarView;
    private service: AuthenticateService;

    public constructor(view: AppNavbarView) {
        this.view = view;
        this.service = new AuthenticateService();
    }

    public async logOut(){
        this.view.displayInfoMessage("Logging Out...", 0);

        try {
            await this.service.logout(this.view.authToken!);

            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
            this.view.navigateTo("/login");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user out because of exception: ${error}`
            );
        }
    };
}