import {AuthToken, User} from "tweeter-shared";
import {UserService} from "../../model/UserService";
import {MessageView, Presenter} from "../Presenter";

export interface UserInfoView extends MessageView {
    authToken: AuthToken | null,
    displayedUser: User | null,
    setDisplayedUser: (user: User) => void
    setIsFollower: (value: boolean) => void,
    setFolloweesCount: (value: number) => void,
    setFollowersCount: (value: number) => void,
}

export class UserInfoPresenter extends Presenter<UserInfoView>{
    private service: UserService

    public constructor(view: UserInfoView)
    {
        super(view)
        this.service = new UserService()
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ){
        await this.reportFailingAction(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        }, 'determine follower status');
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ){
        await this.reportFailingAction(async () => {
            this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
        }, 'get followees count');
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.reportFailingAction(async () => {
            this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
        }, 'get followers count');
    }



    public async followDisplayedUser(
        event: React.MouseEvent
    ): Promise<void> {
        event.preventDefault();
        await this.reportFailingAction(async () => {
            this.view.displayInfoMessage(`Adding ${this.view.displayedUser!.name} to followers...`, 0);

            let [followersCount, followeesCount] = await this.service.follow(
                this.view.authToken!,
                this.view.displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(true);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        }, 'follow user');
    };

    public async unfollowDisplayedUser(
        event: React.MouseEvent
    ): Promise<void> {
        event.preventDefault();
        await this.reportFailingAction(async () => {
            this.view.displayInfoMessage(
                `Removing ${this.view.displayedUser!.name} from followers...`,
                200
            );

            let [followersCount, followeesCount] = await this.service.unfollow(
                this.view.authToken!,
                this.view.displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(false);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        }, 'unfollow user');
    };
}