import { render, screen } from '@testing-library/react'
import {MemoryRouter} from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import Login from "../../src/components/authentication/login/Login";
import {UserEvent, userEvent} from "@testing-library/user-event";
import "@testing-library/jest-dom"
import {LoginPresenter} from "../../src/presenter/authentication/LoginPresenter";
import * as m from "ts-mockito"

library.add(fab)

describe('Login Component', () => {
    const originalUrl: string = "https://someurl.com";
    const alias: string = "@someAlias";
    const password: string = "myPasword";

    it('disables sign-in button when first rendered', () => {
        const { signInBtn } = renderLoginAndGetElements("/")
        expect(signInBtn).toBeDisabled()
    })

    it('enables sign-in button when both the alias and password fields have text', async () => {
        const { signInBtn, aliasField, passwordField, user } = renderLoginAndGetElements("/")
        await fillLoginFields(user, aliasField, "alias", passwordField, "password");

        expect(signInBtn).toBeEnabled();
    })

    it('disables sign-in button if either the alias or password field is cleared', async () => {
        const { signInBtn, aliasField, passwordField, user } =
            renderLoginAndGetElements("/")
        await fillLoginFields(user, aliasField, "alias", passwordField, "password");

        await user.clear(aliasField)
        expect(signInBtn).toBeDisabled();

        await user.type(aliasField, "alias")
        expect(signInBtn).toBeEnabled();

        await user.clear(passwordField)
        expect(signInBtn).toBeDisabled();
    })

    it('calls presenter\'s login method with correct parameters when the sign-in button is pressed', async () => {
        const mockPresenter = m.mock<LoginPresenter>();
        const mockPresenterInstance = m.instance(mockPresenter);

        const { signInBtn, aliasField, passwordField, user } =
            renderLoginAndGetElements(originalUrl, mockPresenterInstance);

        await fillLoginFields(user, aliasField, alias, passwordField, password);
        await user.click(signInBtn);

        m.verify(mockPresenter.login(alias, password, originalUrl)).once()
    })
});

const fillLoginFields = async (
    user: UserEvent,
    aliasField: HTMLElement,
    aliasText: string,
    passwordField: HTMLElement,
    passwordText: string,
) => {
    await user.type(aliasField, aliasText);
    await user.type(passwordField, passwordText);
}

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter}/>
            ) : (
                <Login originalUrl={originalUrl}/>
            )}
        </MemoryRouter>);
}

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();
    renderLogin(originalUrl, presenter);

    const signInBtn = screen.getByRole("button", {name: /Sign in/i});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { signInBtn, aliasField, passwordField, user }
}