import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import userApi from "../api/userApi";
import { ErrorComp } from "./ErrorComp";

export const ProtectedAfterSignup = ({ children }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState({
    value: true,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      userApi
        .getUser(id)
        .then((user) => {
          console.log("user", user);
          // if user is verified redirect to home
          if (user.isVerified) {
            setIsVerified(true);
          }
          // allow childrn to appear
          setError({
            ...error,
            value: false,
          });
        })
        // set error
        .catch((err) => {
          if (err.type === "UserNotFound") {
            setError({
              ...error,
              ...err,
            });
          } else {
            setError({
              type: "ServerError",
              message: "Something went wrong!, please refresh",
            });
          }
        });
    }
  }, []);

  useEffect(() => {}, [isVerified, error.value, error.type, error.message]);

  return (
    <div>
      {(!id || error.type === "UserNotFound" || isVerified) && (
        <Navigate to="/" replace />
      )}
      {error.type == "ServerError" && <ErrorComp error={error.message} />}
      {!error.value && children}
    </div>
  );
};
