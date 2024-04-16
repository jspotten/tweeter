import { ServerFacade } from "../../src/model/network/ServerFacade";
import "@testing-library/jest-dom"
import {
    AuthToken,
    LoadMoreStatusesRequest,
    LoginRequest,
    User
} from "tweeter-shared";
import "isomorphic-fetch";
import {PostStatusPresenter, PostStatusView} from "../../src/presenter/main/PostStatusPresenter";
import * as m from "ts-mockito";

describe('Client-Side ServerFacade Communications with Server',  () => {
    const serverFacade = new ServerFacade()
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;

    let testUser: User = new User(
        'Donald',
        'Trump',
        '@DonaldTrump',
        'https://tweeter-images-jaden.s3.us-west-2.amazonaws.com/images/@DonaldTrump',
    )
    const testAuthToken =
        new AuthToken("11e2371e-ea29-44d8-8ca7-b264eb643801", 999999999999999999999)

    beforeEach(() => {
        mockPostStatusView = m.mock<PostStatusView>();
        const mockPostStatusViewInstance = m.instance(mockPostStatusView);

        const postStatusPresenterSpy = m.spy(new PostStatusPresenter(mockPostStatusViewInstance))
        postStatusPresenter = m.instance(postStatusPresenterSpy);
    })


    it('correctly posts new status to the user\'s story', async () => {

        const loginRequest = new LoginRequest(
            testUser.alias,
            'password',
        )
        await serverFacade.login(loginRequest);
        await postStatusPresenter.postStatus("UserStory Test", testUser, testAuthToken)
        m.verify(mockPostStatusView.displayInfoMessage("Status posted!", 200)).once()

        const loadMoreStatusesRequest: LoadMoreStatusesRequest = new LoadMoreStatusesRequest(
            testAuthToken, testUser, 1, null
        )
        const response = await serverFacade.loadMoreStoryItems(loadMoreStatusesRequest)

        expect(response.items[0].user.alias).toEqual(testUser.alias);
        expect(response.message).toEqual('Successful Loading of More Feed Items');
        expect(response.items[0].post).toEqual("UserStory Test");
    });
})
