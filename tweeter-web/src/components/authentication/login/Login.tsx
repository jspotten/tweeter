import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToastListener from "../../toaster/ToastListenerHook";
import {AuthFields} from "../AuthFields";
import {LoginPresenter, LoginView} from "../../../presenter/LoginPresenter";
import AuthenticationFormLayout from "../AuthenticationFormLayout";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: LoginView = {
    alias: alias,
    password: password,
    navigateTo: navigate,
    displayErrorMessage: displayErrorMessage
  }

  const [presenter] = useState(new LoginPresenter(listener));

  const doLogin = async () => {
      await presenter.doLogin(props.originalUrl!, rememberMeRef.current)
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
