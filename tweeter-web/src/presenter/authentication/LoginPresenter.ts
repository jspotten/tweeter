import {AuthenticationPresenter, AuthenticationView} from "./AuthenticationPresenter";
import {AuthToken, User} from "tweeter-shared";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView>
{
    public constructor(view: AuthenticationView)
    {
        super(view);
    }

    public async login(alias: string, password: string, url: string)
    {
        await this.authenticate(!!url ? url : '/', alias, password)
    }

    protected validate(alias: string, password: string): Promise<[User, AuthToken]> {
        return this.service.login(
            alias,
            password,
        );
    }

    protected getItemDetails(): string {
        return 'log user in';
    }
}