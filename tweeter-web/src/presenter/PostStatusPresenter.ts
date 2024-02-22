import {AuthToken, Status, User} from "tweeter-shared";
import {StatusService} from "../model/StatusService";

export interface PostStatusView {
    post: string,
    setPost: (value: string) => void,
    currentUser: User | null,
    authToken: AuthToken | null,
    displayInfoMessage: (msg: string, status: number) => void,
    clearLastInfoMessage: () => void,
    displayErrorMessage: (msg: string) => void,
}

export class PostStatusPresenter
{
    private view: PostStatusView;
    private service: StatusService;

    public constructor(view: PostStatusView)
    {
        this.view = view;
        this.service = new StatusService()
    }


    public async submitPost(event: React.MouseEvent)
    {
        event.preventDefault();

        try {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(this.view.post, this.view.currentUser!, Date.now());

            await this.service.postStatus(this.view.authToken!, status);

            this.view.clearLastInfoMessage();
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        }
    };

    public clearPost(event: React.MouseEvent)
    {
        event.preventDefault();
        this.view.setPost("");
    };
}