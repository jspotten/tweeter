import {LoginService} from "../model/LoginService";
import {AuthToken, User} from "tweeter-shared";

export interface LoginView {
    alias: string,
    password: string,
    navigateTo: (url: string) => void,
    updateUserInfo: (user1: User, user2: User, authToken: AuthToken, rememberMe: boolean) => void,
    displayErrorMessage: (msg: string) => void,
}

export class LoginPresenter
{
    private view: LoginView;
    private service: LoginService;

    public constructor(view: LoginView)
    {
        this.view = view
        this.service = new LoginService()
    }

    public async doLogin(url: string, rememberMe: boolean)
    {
        try
        {
            let [user, authToken] = await this.service.login(this.view.alias, this.view.alias);
            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!url)
            {
                this.view.navigateTo(url);
            }
            else
            {
                this.view.navigateTo("/");
            }
        }
        catch (error)
        {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    }
}