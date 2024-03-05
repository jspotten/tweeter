import {PostStatusPresenter, PostStatusView} from "../../src/presenter/main/PostStatusPresenter";
import {StatusService} from "../../src/model/StatusService";
import {AuthToken, Status, User} from "tweeter-shared";
import * as m from 'ts-mockito'

describe('PostStatusPresenter', () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;

    const authToken = new AuthToken('token', Date.now())
    const post: string = "I'm excited to announce my graduation!";
    const currUser: User = new User("Inigo", 'Montoya', 'pbride', 'https://images.com/pbride.png');


    beforeEach(() => {
        mockPostStatusView = m.mock<PostStatusView>();
        const mockPostStatusViewInstance = m.instance(mockPostStatusView);

        const postStatusPresenterSpy = m.spy(new PostStatusPresenter(mockPostStatusViewInstance))
        postStatusPresenter = m.instance(postStatusPresenterSpy);

        mockStatusService = m.mock<StatusService>()
        const mockStatusServiceInstance = m.instance(mockStatusService)

        m.when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance)
    })


    it('tells the view to display a posting status message', async () => {
        await postStatusPresenter.postStatus(post, currUser, authToken)
        m.verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    })


    it('calls postStatus on the post status service with the correct status string and auth token', async () => {
        await postStatusPresenter.postStatus(post, currUser, authToken)
        m.verify(mockStatusService.postStatus(authToken, m.anything())).once()
        let [_authToken, status] = m.capture(mockStatusService.postStatus).last()
        expect(status.post).toEqual(post)
    })


    it('tells the view, upon successful status posting, to clear the last info message/post and display status posted message', async () => {
        await postStatusPresenter.postStatus(post, currUser, authToken)
        m.verify(mockPostStatusView.clearLastInfoMessage()).once();
        m.verify(mockPostStatusView.setPost("")).once();
        m.verify(mockPostStatusView.displayInfoMessage("Status posted!", 200)).once();

        m.verify(mockPostStatusView.displayErrorMessage(m.anything())).never()
    })


    it('tells the view, upon unsuccessful status posting, to display an error message', async () => {
        const errorAction: string = 'An error occurred while posting message';
        const error = new Error(errorAction)
        m.when(mockStatusService.postStatus(authToken, m.anything())).thenThrow(error)

        await postStatusPresenter.postStatus(post, currUser, authToken)
        const errorMsg = `Failed to post the status because of exception: ${errorAction}`

        m.verify(mockPostStatusView.displayErrorMessage(m.anything())).once()
        let [_error] = m.capture(mockPostStatusView.displayErrorMessage).last()
        expect(_error).toEqual(errorMsg)

        m.verify(mockPostStatusView.clearLastInfoMessage()).never();
        m.verify(mockPostStatusView.setPost("")).never();
        m.verify(mockPostStatusView.displayInfoMessage(m.anything(), 200)).never();
    })
});
