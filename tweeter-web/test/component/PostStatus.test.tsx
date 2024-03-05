import { render, screen } from '@testing-library/react'
import {MemoryRouter} from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { userEvent} from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { PostStatusPresenter } from "../../src/presenter/main/PostStatusPresenter";
import * as m from "ts-mockito"
import {AuthToken, User} from "tweeter-shared";
import useUserInfoHook from "../../src/components/userInfo/UserInfoHook";

library.add(fab)

jest.mock("../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));

describe('PostStatus Component', () => {
    const post: string = "I'm excited to announce my graduation!";
    const currUser: User = new User("Inigo", 'Montoya', 'pbride', 'https://images.com/pbride.png');
    const mockUser = m.mock<User>(currUser)
    const mockUserInstance = m.instance(mockUser);
    const authToken = new AuthToken('token', Date.now())
    const mockAuthToken = m.mock<AuthToken>(authToken)
    const mockAuthTokenInstance = m.instance(mockAuthToken)

    beforeAll(() => {
        (useUserInfoHook as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    })

    it('disables post status and clear buttons when first rendered', () => {
        const { postStatusBtn, clearStatusBtn } = renderPostStatusAndGetElements()
        expect(postStatusBtn).toBeDisabled()
        expect(clearStatusBtn).toBeDisabled()
    })

    it('enables both buttons when the text field has text', async () => {
        const { postStatusBtn, clearStatusBtn, textBoxField, user } =
            renderPostStatusAndGetElements()
        await user.type(textBoxField, post)

        expect(postStatusBtn).toBeEnabled()
        expect(clearStatusBtn).toBeEnabled()
    })

    it('disables both buttons when the text field is cleared', async () => {
        const { postStatusBtn, clearStatusBtn, textBoxField, user } =
            renderPostStatusAndGetElements()
        await user.type(textBoxField, post)

        expect(postStatusBtn).toBeEnabled()
        expect(clearStatusBtn).toBeEnabled()

        await user.clear(textBoxField)

        expect(postStatusBtn).toBeDisabled()
        expect(clearStatusBtn).toBeDisabled()
    })

    it('calls presenter\'s postStatus method with correct parameters when the post status button is pressed', async () => {
        const mockPresenter = m.mock<PostStatusPresenter>();
        const mockPresenterInstance = m.instance(mockPresenter);

        const { postStatusBtn, textBoxField, user } =
            renderPostStatusAndGetElements(mockPresenterInstance)

        await user.type(textBoxField, post)
        await user.click(postStatusBtn);

        m.verify(mockPresenter.postStatus(m.anything(), m.anything(), m.anything())).once()
        let [msg, _user] = m.capture(mockPresenter.postStatus).last()
        expect(msg).toEqual(post)
    })
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <PostStatus presenter={presenter}/>
                ) : (
                <PostStatus/>
            )}
        </MemoryRouter>
    );
}

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();
    renderPostStatus(presenter);

    const postStatusBtn = screen.getByLabelText('post-status');
    const clearStatusBtn = screen.getByLabelText('clear-status');
    const textBoxField = screen.getByLabelText('post-textarea')

    return { postStatusBtn, clearStatusBtn, textBoxField, user }
}