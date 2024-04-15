import { ServerFacade } from "../../src/model/network/ServerFacade";
import "@testing-library/jest-dom"
import {
    AuthToken,
    FollowCountRequest, LoadMoreStatusesRequest,
    LoadMoreUsersRequest, LoginRequest,
    RegisterRequest, Status,
    User
} from "tweeter-shared";
import "isomorphic-fetch";
import {StatusService} from "../../src/model/service/StatusService";
import {LoginPresenter} from "../../src/presenter/authentication/LoginPresenter";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Login from "../../src/components/authentication/login/Login";
import {UserEvent, userEvent} from "@testing-library/user-event/index";
import {StoryPresenter} from "../../src/presenter/main/StoryPresenter";
import {ItemScroller} from "../../src/components/mainLayout/ItemScroller";
import {PagedItemView} from "../../src/presenter/PagedItemPresenter";
import StatusItem from "../../src/components/statusItem/StatusItem";
import PostStatus from "../../src/components/postStatus/PostStatus";
import {PostStatusPresenter} from "../../src/presenter/main/PostStatusPresenter";
import * as m from "ts-mockito";

describe('Client-Side ServerFacade Communications with Server',  () => {
    const serverFacade = new ServerFacade()
    let testUser: User = new User(
        'Donald',
        'Trump',
        '@DonaldTrump',
        'https://tweeter-images-jaden.s3.us-west-2.amazonaws.com/images/@DonaldTrump',
    )
    const testAuthToken =
        new AuthToken("11e2371e-ea29-44d8-8ca7-b264eb643801", 989824823)

    it('correctly posts new status to the user\'s story', async () => {
        const mockPresenter = m.mock<PostStatusPresenter>();
        const mockPresenterInstance = m.instance(mockPresenter);
        const loginRequest = new LoginRequest(
            testUser.alias,
            'password',
        )

        const response = await serverFacade.login(loginRequest);
        // expect(response).toEqual(expect.objectContaining( {
        //     _user: expect.any(User),
        //     _token: expect.any(AuthToken),
        //     _success: true,
        //     _message: 'Successful Registration'
        // }))

        const { user, postField, postBtn} = renderPostStatusAndGetElements(mockPresenterInstance);
        await user.type(postField, "This is a test status");
        await user.click(postBtn);
    });
})

const renderPostStatus = (presenter: PostStatusPresenter) => {
    return render(
        <MemoryRouter>
            <PostStatus
                presenter={presenter}
            />
        </MemoryRouter>);
    }


const renderPostStatusAndGetElements = (presenter: PostStatusPresenter) => {
    const user = userEvent.setup();
    renderPostStatus(presenter)

    const postField = screen.getByLabelText('postStatusTextArea');
    const postBtn = screen.getByLabelText('post-status');

    return { user, postField, postBtn }
}
