import {AuthToken, Status, User} from "tweeter-shared";
import {StatusService} from "../../model/service/StatusService";
import {MessageView, Presenter} from "../Presenter";

export interface PostStatusView extends MessageView {
    setPost: (value: string) => void,
}

export class PostStatusPresenter extends Presenter<PostStatusView>
{
    private _service: StatusService | null = null;

    public constructor(view: PostStatusView)
    {
        super(view);
    }

    public get service()
    {
        return this._service ? this._service : new StatusService()
    }

    public async postStatus(post: string, currentUser: User | null,
                            authToken: AuthToken | null)
    {
        await this.reportFailingAction(async () => {
            this.view.displayInfoMessage("Posting status...", 0);
            let status = new Status(post, currentUser!, Date.now());

            const success = await this.service.postStatus(authToken!, status);

            this.view.clearLastInfoMessage();
            this.view.setPost("");
            if(success)
            {
                this.view.displayInfoMessage("Status posted!", 200);
            }
            else
            {
                this.view.displayInfoMessage("Unable to post the status!", 500);
            }
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