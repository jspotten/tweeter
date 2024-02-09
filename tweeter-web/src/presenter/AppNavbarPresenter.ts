import {AuthToken} from "tweeter-shared";
import {LogoutService} from "../model/LogoutService";

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
    private service: LogoutService;

    public constructor(view: AppNavbarView) {
        this.view = view;
        this.service = new LogoutService();
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