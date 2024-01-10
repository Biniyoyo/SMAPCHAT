import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../components/Layout/Layout";
import CreatePage from "../components/pages/CreatePage/CreatePage";
import MyMapsPage from "../components/pages/MyMapsPage/MyMapsPage";
import HomePage from "../components/pages/Home/HomePage";
import ViewMapPage from "../components/pages/ViewMapPage/ViewMapPage";
import MapEditPage from "../components/pages/MapEditPage/MapEditPage";
import ManageUserPage from "../components/pages/ManageUserPage/ManageUserPage";
import LoginPage from "../components/pages/AuthPages/LoginPage";
import SignupPage from "../components/pages/AuthPages/SignupPage";
import PasswordRecoveryPage from "../components/pages/AuthPages/PasswordRecoveryPage";
import ElementDemo from "../components/pages/ElementDemo";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="create-page" element={<CreatePage />} />
      <Route path="my-maps-page/:userId" element={<MyMapsPage />} />
      <Route path="view-map-page/:mapId" element={<ViewMapPage />} />
      <Route path="map-edit-page/:mapType" element={<MapEditPage />} />
      <Route path="manage-user-page" element={<ManageUserPage />} />
      <Route path="login-page" element={<LoginPage />} />
      <Route path="signup-page" element={<SignupPage />} />
      <Route path="password-recovery-page" element={<PasswordRecoveryPage />} />
      <Route path="element-demo" element={<ElementDemo />} />
    </Route>,
  ),
);
