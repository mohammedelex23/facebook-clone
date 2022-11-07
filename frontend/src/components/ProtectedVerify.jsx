import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import userApi from "../api/userApi";

export const ProtectedVerify = ({ children }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [values, setValues] = useState({
    ready: false,
    error: false,
  });

  useEffect(
    () => {
      if (!id) {
        setValues({
          ready: false,
          error: true,
        });
      } else {
        // find user and check whether it is verified or not
        (async function () {
          try {
            let user = await userApi.getUser(id);
            // if user is verified redirect to login
            if (user.isVerified) {
              setValues({
                ready: false,
                error: true,
              });
            } else {
              setValues({
                ready: true,
                error: false,
              });
            }
          } catch (err) {
            setValues({
              ready: false,
              error: true,
            });
          }
        })();
      }
    },
    [id],
    values.error,
    values.ready
  );

  return (
    <div>
      {values.error && <Navigate to="/" replace />}
      {values.ready && children}
    </div>
  );
};
