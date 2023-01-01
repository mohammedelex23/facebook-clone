import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import authHelpers from "../helpers/authHelpers";

export const ProtectedAuth = ({ children }) => {
  const [values, setValues] = useState({
    status: "idle",
    isAuth: false,
  });

  useEffect(() => {

    const isAuthFunc = async () => {
      setValues({ status: "fetching" });
      let isAuth = await authHelpers.isAuthenticated();
      setValues({ status: "fetched", isAuth });
    };
    isAuthFunc();
  }, []);

  return (
    <>
      {values.status === "fetched" && values.isAuth && (
        <Navigate to="/home" replace />
      )}
      {values.status === "fetched" && !values.isAuth && children}
    </>
  );

  // if (authHelpers.isAuthenticated()) {
  //   // if authenticated redirect to home
  //   return <Navigate to="/home" replace />;
  // } else {
  //   return children;
  // }
};
