import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import {ChangeEvent, useRef, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import {AuthFields} from "../AuthFields";
import {RegisterPresenter, RegisterView} from "../../../presenter/RegisterPresenter";
import {useUserInfoHook} from "../../userInfo/UserInfoHook";
import {AuthToken, User} from "tweeter-shared";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const navigate = useNavigate();
  const { displayErrorMessage } = useToastListener();
  const { updateUserInfo } = useUserInfoHook();

  const checkSubmitButtonStatus = (): boolean => {
    return !firstName || !lastName || !alias || !password || !imageUrl;
  };

  const authenticate = (user: User, authToken: AuthToken) => {
    updateUserInfo(user, user, authToken, rememberMe)
  }

  const listener: RegisterView = {
    setImageBytes: setImageBytes,
    imageUrl: imageUrl,
    setImageUrl: setImageUrl,
    navigateTo: navigate,
    authenticate: authenticate,
    displayErrorMessage: displayErrorMessage
  }

  const [presenter] = useState(new RegisterPresenter(listener));

  const doRegister = async () => {
    await presenter.register(firstName, lastName, alias, password, imageBytes)
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) =>
  {
    const file: File | undefined = event.target.files?.[0];
    presenter.handleImageFile(file);
  }

  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>

        <AuthFields setAlias={ setAlias } setPassword={ setPassword } marginBottom={ false }/>

        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onChange={handleFileChange}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doRegister}
    />
  );
};

export default Register;
