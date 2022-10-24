import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export const Index = () => {
  const [email, setEmail] = useState({
    value: "",
    style: {
      border: "1px solid black",
    },
  });
  const [password, setPassword] = useState({
    value: "",
    style: {
      border: "1px solid black",
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [email.value, email.style, password.value, password.style]);

  const handleChange = (type) => (e) => {
    switch (type) {
      case "email":
        setEmail({ ...email, value: e.target.value });
        break;
      case "password":
        setPassword({ ...password, value: e.target.value });
        break;
      default:
        break;
    }
  };

  const handleOnBlur = (type) => (e) => {
    switch (type) {
      case "email":
        if (
          !email.value ||
          (email.value && !email.value.trim()) ||
          !new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(e.target.value)
        ) {
          setEmail({
            ...email,
            style: {
              border: "1px solid red",
            },
          });
        } else {
          setEmail({
            ...email,
            style: {
              border: "1px solid black",
            },
          });
        }
        break;
      case "password":
        if (!password.value || (password.value && !password.value.trim())) {
          setPassword({
            ...password,
            style: {
              border: "1px solid red",
            },
          });
        } else {
          setPassword({
            ...password,
            style: {
              border: "1px solid black",
            },
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen md:bg-gray-200  md:p-3">
      {/* container */}
      <div className="md:flex md:justify-center flex-grow md:mx-auto md:mt-48 lg:w-[55%]">
        {/* title */}
        <div className="text-center flex-1 py-6 sm:mb-3 sm:py-0 sm:px-2 md:text-start md:flex-1">
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
        <div className="mx-3 flex-grow flex-1 px-3 sm:m-auto sm:flex sm:justify-center sm:w-3/5 md:m-0 md:p-0 md:flex-2">
          <div>
            <div className="md:shadow-xl md:p-5 md:rounded-md md:bg-white">
              {/* form */}
              <form action="">
                {/* email */}
                <input
                  required
                  className="bg-slate-100 shadow-sm rounded border w-full mb-2  p-2"
                  name="email"
                  placeholder="Email"
                  value={email.value}
                  onChange={handleChange("email")}
                  style={email.style}
                  onBlur={handleOnBlur("email")}
                />
                {/* password */}
                <input
                  required
                  className="bg-slate-100 shadow-sm rounded border w-full mb-2  p-2"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password.value}
                  onChange={handleChange("password")}
                  style={password.style}
                  onBlur={handleOnBlur("password")}
                />
                {/* login button */}
                <button className="w-full shadow-sm rounded p-2 bg-blue-600 text-white text-xl">
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
