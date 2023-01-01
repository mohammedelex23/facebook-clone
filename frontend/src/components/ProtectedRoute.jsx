import { useState } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import authHelpers from "../helpers/authHelpers";

export const ProtectedRoute = ({ children, name }) => {
  const { pathname } = useLocation();

  const [values, setValues] = useState({
    status: "idle",
    isAuth: false,
  });

  useEffect(() => {
    const isAuthFunc = async () => {
      setValues({ ...values, status: "fetching" });
      let isAuth = await authHelpers.isAuthenticated();
      setValues({ ...values, status: "fetched", isAuth });
    };
    isAuthFunc();

    return () => {
      setValues({
        ...values,
        status: "idle",
        isAuth: false,
      });
    };
  }, [name]);

  return (
    <>
      {values.status === "idle" && <div>Loading...</div>}
      {values.status === "fetched" && !values.isAuth && (
        <Navigate to="/" state={pathname} replace />
      )}
      {values.status === "fetched" && values.isAuth && children}
    </>
  );

  // if (!authHelpers.isAuthenticated()) {
  //   // if not authenticated redirect to login: /
  //   return <Navigate to="/" state={location.pathname} replace />;
  // } else {
  //   return children;
  // }
};
