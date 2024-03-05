import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToastListener from "../../toaster/ToastListenerHook";
import {AuthFields} from "../AuthFields";
import {LoginPresenter} from "../../../presenter/authentication/LoginPresenter";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useUserInfoHook from "../../userInfo/UserInfoHook";
import {AuthToken, User} from "tweeter-shared";
import {AuthenticationView} from "../../../presenter/authentication/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { displayErrorMessage } = useToastListener();
  const {updateUserInfo} = useUserInfoHook()

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const authenticate = (user: User, authToken: AuthToken) => {
    updateUserInfo(user, user, authToken, rememberMe)
  }

  const listener: AuthenticationView = {
    authenticate: authenticate,
    navigateTo: navigate,
    displayErrorMessage: displayErrorMessage
  }

  const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));

  const doLogin = async () => {
      await presenter.login(alias, password, props.originalUrl!)
  };



  const checkSubmitButtonStatus = () =>
  {
    return !alias || !password;
  }

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthFields setAlias={ setAlias } setPassword={ setPassword } marginBottom={ true }/>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;
