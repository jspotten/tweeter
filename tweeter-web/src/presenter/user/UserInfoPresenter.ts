import {AuthToken, User} from "tweeter-shared";
import {UserService} from "../../model/service/UserService";
import {MessageView, Presenter} from "../Presenter";

export interface UserInfoView extends MessageView {
    authToken: AuthToken | null,
    displayedUser: User | null,
    setDisplayedUser: (user: User) => void
    setIsFollower: (value: boolean) => void,
    setFolloweesCount: (value: number) => void,
    setFollowersCount: (value: number) => void,
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private service: UserService

    public constructor(view: UserInfoView) {
        super(view)
        this.service = new UserService()
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
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
    ) {
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
        await this.updateFollow(
            this.service.follow(this.view.authToken!, this.view.displayedUser!),
            'Adding',
            'follow user',
            true,
            event,
        )
    };

    public async unfollowDisplayedUser(
        event: React.MouseEvent
    ): Promise<void> {
        await this.updateFollow(
            this.service.unfollow(this.view.authToken!, this.view.displayedUser!),
            'Removing',
            'unfollow user',
            false,
            event)
    };


    protected async updateFollow(
        action:  Promise<[followersCount: number, followeesCount: number]>,
        actionStr: string,
        actionDetails: string,
        isFollower: boolean,
        event: React.MouseEvent,
    ): Promise<void> {
        event.preventDefault();
        await this.reportFailingAction(async () => {
            this.displayMessage(actionStr)

            console.log('before action')
            let [followersCount, followeesCount] = await action;
            console.log('after action')
            this.view.clearLastInfoMessage();

            this.view.setIsFollower(isFollower);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        }, actionDetails);
    }

    protected displayMessage(action: string)
    {
        this.view.displayInfoMessage(
            `${action} ${this.view.displayedUser!.name} from followers...`,
            0
        );
    }
}