import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

export const useUserInfoHook = () =>
    useContext(UserInfoContext);
