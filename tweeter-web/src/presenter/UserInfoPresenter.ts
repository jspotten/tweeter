import {AuthToken, User} from "tweeter-shared";
import {UserService} from "../model/UserService";

export interface UserInfoView {
    authToken: AuthToken | null,
    displayedUser: User | null,
    setDisplayedUser: (user: User) => void
    setIsFollower: (value: boolean) => void,
    setFolloweesCount: (value: number) => void,
    setFollowersCount: (value: number) => void,
    displayErrorMessage: (msg: string) => void,
    displayInfoMessage: (msg: string, code: number) => void,
    clearLastInfoMessage: () => void,
}

export class UserInfoPresenter {
    private view: UserInfoView;
    private service: UserService

    public constructor(view: UserInfoView)
    {
        this.view = view;
        this.service = new UserService()
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ){
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ){
        try {
            this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    }



    public async followDisplayedUser(
        event: React.MouseEvent
    ): Promise<void> {
        event.preventDefault();

        try {
            this.view.displayInfoMessage(`Adding ${this.view.displayedUser!.name} to followers...`, 0);

            let [followersCount, followeesCount] = await this.service.follow(
                this.view.authToken!,
                this.view.displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(true);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        }
    };

    public async unfollowDisplayedUser(
        event: React.MouseEvent
    ): Promise<void> {
        event.preventDefault();

        try {
            this.view.displayInfoMessage(
                `Removing ${this.view.displayedUser!.name} from followers...`,
                0
            );

            let [followersCount, followeesCount] = await this.service.unfollow(
                this.view.authToken!,
                this.view.displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(false);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`
            );
        }
    };
}