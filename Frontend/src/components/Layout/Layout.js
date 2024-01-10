import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="wholePage">
      <Header />
      <Outlet className="outlet" />
    </div>
  );
};
export default Layout;
