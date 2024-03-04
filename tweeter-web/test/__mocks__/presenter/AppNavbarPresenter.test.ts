import {AppNavbarPresenter, AppNavbarView} from "../../../src/presenter/main/AppNavbarPresenter";
import * as m from 'ts-mockito'
import {AuthenticateService} from "../../../src/model/AuthenticateService";
import {AuthToken} from "tweeter-shared";

describe('AppNavbarPresenter', () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockAuthService: AuthenticateService;

    const authToken = new AuthToken('token', Date.now())

    beforeEach(() => {
        mockAppNavbarView = m.mock<AppNavbarView>();
        const mockAppNavbarViewInstance = m.instance(mockAppNavbarView);

        const appNavbarPresenterSpy = m.spy(new AppNavbarPresenter(mockAppNavbarViewInstance))
        appNavbarPresenter = m.instance(appNavbarPresenterSpy);

        mockAuthService = m.mock<AuthenticateService>()
        const mockAuthServiceInstance = m.instance(mockAuthService)

        m.when(appNavbarPresenterSpy.service).thenReturn(mockAuthServiceInstance)
    })

    it('tells the view to display a logging out message', async () => {
        await appNavbarPresenter.logout(authToken)
        m.verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
    })

    it('calls logout on the user service with the correct auth token', async () => {
        await appNavbarPresenter.logout(authToken)
        m.verify(mockAuthService.logout(authToken)).once()

    })

    it('tells the view, upon successful logout, to clear the last info message/user info and navigate to the login page', async () => {
        await appNavbarPresenter.logout(authToken)
        m.verify(mockAppNavbarView.clearLastInfoMessage()).once();
        m.verify(mockAppNavbarView.clearUserInfo()).once();
        m.verify(mockAppNavbarView.navigateTo("/login")).once();

        m.verify(mockAppNavbarView.displayErrorMessage(m.anything())).never()
    })

    it('tells the view, upon unsuccessful logout, to display an error message', async () => {
        const errorAction: string = 'An error occurred during logout'
        const error = new Error(errorAction)
        m.when(mockAuthService.logout(authToken)).thenThrow(error)

        await appNavbarPresenter.logout(authToken)
        const errorMsg = `Failed to log user out because of exception: ${errorAction}`

        m.verify(mockAppNavbarView.displayErrorMessage(errorMsg)).once()

        m.verify(mockAppNavbarView.clearLastInfoMessage()).never();
        m.verify(mockAppNavbarView.clearUserInfo()).never();
        m.verify(mockAppNavbarView.navigateTo("/login")).never();
    })
});