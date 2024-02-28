import {AuthToken, Status, User} from "tweeter-shared";
import {StatusService} from "../../model/StatusService";
import {MessageView, Presenter} from "../Presenter";

export interface PostStatusView extends MessageView {
    post: string,
    setPost: (value: string) => void,
    currentUser: User | null,
    authToken: AuthToken | null,
}

export class PostStatusPresenter extends Presenter<PostStatusView>
{
    private service: StatusService;

    public constructor(view: PostStatusView)
    {
        super(view);
        this.service = new StatusService()
    }


    public async submitPost(event: React.MouseEvent)
    {
        event.preventDefault();
        await this.reportFailingAction(async () => {
            this.view.displayInfoMessage("Posting status...", 0);
            let status = new Status(this.view.post, this.view.currentUser!, Date.now());

            await this.service.postStatus(this.view.authToken!, status);

            this.view.clearLastInfoMessage();
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 200);
        }, this.getItemDetails())
    };

    public clearPost(event: React.MouseEvent)
    {
        event.preventDefault();
        this.view.setPost("");
    };

    protected getItemDetails(): string {
        return 'post the status';
    }
}