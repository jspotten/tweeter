import { render, screen } from '@testing-library/react'
import {MemoryRouter} from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { userEvent} from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { PostStatusPresenter } from "../../../src/presenter/main/PostStatusPresenter";
import * as m from "ts-mockito"
import {AuthToken, User} from "tweeter-shared";

library.add(fab)

describe('PostStatus Component', () => {
    const post: string = "I'm excited to announce my graduation!";
    const currUser: User = new User("Inigo", 'Montoya', 'pbride', 'https://images.com/pbride.png');
    const authToken = new AuthToken('token', Date.now())

    it('disables post status and clear buttons when first rendered', () => {
        const { postStatusBtn, clearStatusBtn } = renderPostStatusAndGetElements()
        expect(postStatusBtn).toBeDisabled()
        expect(clearStatusBtn).toBeDisabled()

    })

    it('enables both buttons when the text field has text', async () => {
        const { postStatusBtn, clearStatusBtn, textBoxField, user } =
            renderPostStatusAndGetElements()
        await user.type(textBoxField, post)
        console.log(textBoxField.innerHTML)

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

        m.verify(mockPresenter.postStatus(post, currUser, authToken)).once()
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