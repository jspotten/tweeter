import {UserService} from "../model/UserService";
import {AuthToken, User} from "tweeter-shared";
import React from "react";

export interface NavigationView {
    authToken: AuthToken | null,
    currentUser: User | null,
    setDisplayedUser: (user: User) => void,
    displayErrorMessage: (msg: string) => void,
}

export class NavigationPresenter {
    private view: NavigationView;
    private service: UserService;

    public constructor(view: NavigationView) {
        this.view = view;
        this.service = new UserService();
    }

    public async navigateToUser(event: React.MouseEvent)
    {
        event.preventDefault();

        try
        {
            let alias = this.extractAlias(event.target.toString());

            let user = await this.service.getUser(this.view.authToken!, alias);

            if(!!user)
            {
                if(this.view.currentUser!.equals(user))
                {
                    this.view.setDisplayedUser(this.view.currentUser!);
                }
                else
                {
                    this.view.setDisplayedUser(user);
                }
            }
        }
        catch (error)
        {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    }

    public extractAlias(value: string): string
    {
        let index = value.indexOf("@");
        return value.substring(index);
    };
}
