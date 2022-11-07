import { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import authApi from "../api/authApi";

export const Verify = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [values, setValues] = useState({
    ready: false,
    error: false,
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
        });
      } catch (error) {
        console.log(error);
        setValues({
          ...values,
          ready: false,
          error: true,
        });
      }
    })();
  }, [id]);

  return (
    <>
      {values.ready && (
        <div className="w-[320px] md:w-[400px] bg-[#b9b7b7] mt-20 mx-auto px-3 py-4 rounded-sm">
          <p className="">
            Your account is verified you will be redirected to login page.
          </p>
        </div>
      )}
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
