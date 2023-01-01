import { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation, Navigate } from "react-router-dom";
import authApi from "../api/authApi";

export const Verify = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [values, setValues] = useState({
    ready: false,
    error: false,
    redirectToHome: false,
  });

  // component did mount: verify user
  useEffect(() => {
    (async function () {
      try {
        await authApi.verifyUser(id);
        setValues({
          ...values,
          ready: true,
          error: false,
          redirectToHome: false,
        });
        // redirect user to home after 2 seconds
        setTimeout(() => {
          setValues({
            ...values,
            redirectToHome: true,
          });
        }, 2000);
      } catch (error) {
        console.log(error);
        setValues({
          ...values,
          ready: false,
          error: true,
          redirectToHome: false,
        });
      }
    })();
  }, [id, values.ready, values.error, values.redirectToHome]);

  return (
    <>
      {values.ready && (
        <div className="w-[320px] md:w-[400px] bg-[#b9b7b7] mt-20 mx-auto px-3 py-4 rounded-sm">
          <p className="">
            Your account is verified you will be redirected to login page.
          </p>
        </div>
      )}
      {values.redirectToHome && <Navigate to="/home" replace />}
      {values.error && (
        <div className="w-[320px] md:w-[400px] bg-[#b9b7b7] mt-20 mx-auto px-3 py-4 rounded-sm">
          <p>Something went wrong!, refresh the page</p>
          <Link reloadDocument to={location.pathname}>
            Refresh
          </Link>
        </div>
      )}
    </>
  );
};
