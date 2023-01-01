import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { ErrorComp } from "../components/ErrorComp";
import { useLoginFormValidator } from "../components/hooks/useLoginFormValidator";
import authHelpers from "../helpers/authHelpers";
import { initializeLocalUser } from "../redux/slices/localUserSlice";

////////////////////////////////////
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [apiError, setApiError] = useState({
    type: "",
    message: "",
  });

  const { errors, handleOnBlur, validateFormFields } =
    useLoginFormValidator(formState);

  const handleChange = (type) => (e) => {
    let nextFormState = {
      ...formState,
      [type]: e.target.value,
    };

    setFormState(nextFormState);
    validateFormFields({
      errors,
      formState: nextFormState,
      field: e.target.name,
    });
  };

  const handleOnFocus = (e) => {
    if (apiError.type === "NotRegisteredError") {
      setApiError({
        type: "",
        message: "",
      });
    }
  };
  /////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid } = validateFormFields({
      errors,
      formState,
      submitValidation: true,
    });

    if (!isValid) return;

    // call the /login api endpoint
    try {
      let user = await authApi.login({
        email: formState.email,
        password: formState.password,
      });
      // save the token to local storage: token
      authHelpers.authenticateUser(user);
      dispatch(initializeLocalUser(user));
      // redirect user to home page or previous route he came from
      location.state ? navigate(location.state) : navigate("/home");
    } catch (error) {
      if (error.type === "NotVerified") {
        // redirect to verify page
        navigate(`/check_email?id=${error.userId}`);
      } else if (error.type) {
        setApiError(error);
      } else {
        console.log(error);
        setApiError({
          type: "ServerError",
          message: "Something went wrong!, try again",
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen md:bg-gray-200  md:p-3">
      {/* container */}
      <div className="md:flex md:justify-center flex-grow md:mx-auto md:mt-48 md:p-[20px]">
        {/* title */}
        <div className="text-center flex-1 py-6 sm:mb-3 sm:py-0 sm:px-2 md:text-start">
          <h1 className="text-[2rem] font-bold text-blue-700 lg:text-[3rem]">
            <Link reloadDocument to="/">
              facebook
            </Link>
          </h1>
          <p className="hidden md:block">
            Connect with friends and the world around you on Facebook.
          </p>
        </div>

        {/* form container */}
        <div className="mx-3 flex-grow flex-1 px-3 sm:m-auto sm:flex sm:justify-center sm:w-[400px] md:m-0 md:p-0">
          <div className="w-full">
            <div className="md:shadow-xl md:p-5 md:rounded-md md:bg-white">
              {/* form */}
              <form className="w-full" action="" onSubmit={handleSubmit}>
                {/* Error */}
                {(apiError.type === "InvalidError" ||
                  apiError.type === "ServerError") && (
                  <div className="text-center text-lg mb-2">
                    <ErrorComp error={apiError.message} />
                  </div>
                )}
                {/* email */}
                <div className="flex flex-col mb-2">
                  <input
                    autoComplete="off"
                    className="bg-slate-100 border border-black shadow-sm rounded border w-full p-2"
                    name="email"
                    placeholder="Email"
                    value={formState.email}
                    onChange={handleChange("email")}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    style={errors.email.style}
                  />
                  {errors.email.error ? (
                    <ErrorComp error={errors.email.message} />
                  ) : null}
                  {/* api error */}
                  {apiError.type === "NotRegisteredError" && (
                    <ErrorComp error={apiError.message} />
                  )}
                </div>
                {/* password */}
                <div className="flex flex-col mb-2">
                  <input
                    autoComplete="new-password"
                    className="bg-slate-100 border border-black shadow-sm rounded border w-full  p-2"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formState.password}
                    onChange={handleChange("password")}
                    onBlur={handleOnBlur}
                    style={errors.password.style}
                  />
                  {errors.password.error ? (
                    <ErrorComp error={errors.password.message} />
                  ) : null}
                </div>
                {/* login button */}
                <button className="w-full mt-1 shadow-sm rounded p-2 mt-2 bg-blue-600 text-white text-xl">
                  Log in
                </button>
              </form>

              {/* break */}
              <div className="my-5 flex justify-between gap-3 items-center">
                <hr className="flex-1" />
                <span>or</span>
                <hr className="flex-1" />
              </div>

              {/* create account button */}
              <div className="flex justify-center pb-3">
                <Link
                  to="/signup"
                  className="bg-green-600 shadow-sm rounded text-lg text-white px-3 py-1 "
                >
                  Create new account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="pb-2 text-center">Facebook-Clone &copy; 2022</footer>
    </div>
  );
};
