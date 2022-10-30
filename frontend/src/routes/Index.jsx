import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ErrorComp } from "../components/ErrorComp";
import { useLoginFormValidator } from "../components/hooks/useLoginFormValidator";
export const Index = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const { errors, handleOnBlur, validateFormFields, handleOnChange } =
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const { isValid } = validateFormFields({
      errors,
      formState,
      submitValidation: true,
    });

    if (!isValid) return;
    console.log("success submit");
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
                {/* email */}
                <div className="flex flex-col mb-2">
                  <input
                    autoComplete="off"
                    className="bg-slate-100 border border-black shadow-sm rounded border w-full p-2"
                    name="email"
                    placeholder="Email"
                    value={formState.email}
                    onChange={handleChange("email")}
                    onBlur={handleOnBlur}
                    style={errors.email.style}
                  />
                  {errors.email.error ? (
                    <ErrorComp error={errors.email.message} />
                  ) : null}
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
                    style={errors.email.style}
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
      <footer className="mb-2 text-center">Facebook-Clone &copy; 2022</footer>
    </div>
  );
};
