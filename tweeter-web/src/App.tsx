import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfoHook from "./components/userInfo/UserInfoHook";
import {FollowingPresenter} from "./presenter/user/FollowingPresenter";
import {FollowersPresenter} from "./presenter/user/FollowersPresenter";
import {FeedPresenter} from "./presenter/main/FeedPresenter";
import {StoryPresenter} from "./presenter/main/StoryPresenter";
import {ItemScroller} from "./components/mainLayout/ItemScroller";
import {PagedItemView} from "./presenter/PagedItemPresenter";
import {Status, User} from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
    const { currentUser, authToken } = useUserInfoHook();

    const isAuthenticated = (): boolean => {
        return !!currentUser && !!authToken;
    };

    return (
        <div>
            <Toaster position="top-right" />
            <BrowserRouter>
            {isAuthenticated() ? (
                <AuthenticatedRoutes />
            ) : (
                <UnauthenticatedRoutes />
            )}
            </BrowserRouter>
        </div>
    );
};

const AuthenticatedRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/feed" />} />
            <Route
                path="feed"
                element={
                    <ItemScroller
                        presenterGenerator={
                            (view: PagedItemView<Status>) => new FeedPresenter(view)
                        }
                        itemGenerator={(item: Status) => <StatusItem item={item} />}
                        key={'Feed'}
                    />
                }
            />
            <Route
                path="story"
                element={
                    <ItemScroller
                        presenterGenerator={
                            (view: PagedItemView<Status>) => new StoryPresenter(view)
                        }
                        itemGenerator={(item: Status) => <StatusItem item={item} />}
                        key={'Story'}
                    />
                }
            />
            <Route
                path="following"
                element={
                    <ItemScroller
                        presenterGenerator={
                            (view: PagedItemView<User>) => new FollowingPresenter(view)
                        }
                        itemGenerator={(item: User) => <UserItem value={item} />}
                        key={'Following'}
                    />
                }
            />
            <Route
                path="followers"
                element={
                    <ItemScroller
                        presenterGenerator={
                            (view: PagedItemView<User>) => new FollowersPresenter(view)
                        }
                        itemGenerator={(item: User) => <UserItem value={item} />}
                        key={'Followers'}
                    />
                }
            />
            <Route path="logout" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/feed" />} />
            </Route>
        </Routes>
    );
};

const UnauthenticatedRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={
                <Login originalUrl={location.pathname}/>
            } />
        </Routes>
    );
};

export default App;
