import { Outlet, useLocation } from "react-router-dom";
import Conversations from "../components/Conversations";
export const Messages = () => {
  const { pathname } = useLocation();

  return (
    <div className="relative">
      {pathname === "/home/messages" && <Conversations />}
      {pathname === "/home/messages/user" && <Outlet />}
    </div>
  );
};
