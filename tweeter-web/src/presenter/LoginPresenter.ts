import {LoginService} from "../model/LoginService";
import {useUserInfoHook} from "../components/userInfo/UserInfoHook";

export interface LoginView {
    alias: string;
    password: string;
    navigateTo: (url: string) => void
    displayErrorMessage: (msg: string) => void
}

export class LoginPresenter {
    private view: LoginView;
    private service: LoginService;
    private _path: string = "";

    public constructor(view: LoginView) {
        this.view = view
        this.service = new LoginService()
    }

    public async doLogin(url: string, rememberMe: boolean) {
        try {
            let [user, authToken] = await this.service.login(this.view.alias, this.view.alias);
            const { updateUserInfo } = useUserInfoHook()
            updateUserInfo(user, user, authToken, rememberMe);

            if (!!url) {
                this.view.navigateTo(url);
            } else {
                this.view.navigateTo("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    };

    public get path()
    {
        return this._path
    }
}