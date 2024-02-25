import {User} from "tweeter-shared";
import {PagedItemPresenter} from "../PagedItemPresenter";
import {UserService} from "../../model/UserService";

export abstract class UserItemPresenter extends PagedItemPresenter<User, UserService> {
    protected createService(): UserService {
        return new UserService();
    }

}