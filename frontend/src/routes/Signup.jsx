import { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../api/authApi";
import { ErrorComp } from "../components/ErrorComp";

export const Signup = () => {
  const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
  const [lastDay, setLastDay] = useState(29);

  // form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    day: "",
    month: "",
    year: "",
    gender: "",
  });

  useEffect(() => {
    // window.scrollTo(0, 0);
  }, [
    formState.name,
    formState.email,
    formState.password,
    formState.confirmPassword,
    formState.day,
    formState.month,
    formState.year,
    formState.gender,
    lastDay,
  ]);

  const handleChange = (type) => (e) => {
    setFormState({
      ...formState,
      [type]: e.target.value,
    });

    if (type === "month") {
      setLastDay(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(JSON.stringify(formState));
  };

  return (
    <div
      id="signup"
      className="p-7 relative bg-gray-200 h-[auto] overflow-auto"
    >
      {/* title */}
      <h1 className="text-2xl text-blue-500 font-bold text-center my-3">
        Create new account
      </h1>
      {/* form */}
      <form
        className="shadow p-5 rounded-md bg-white sm:w-3/5 sm:mx-auto lg:w-[400px]"
        onSubmit={handleSubmit}
      >
        {/* name */}
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="name">
            Name
          </label>
          <input
            required
            name="name"
            className="border border-black shadow-sm rounded border w-full mb-2  p-2"
            type="text"
            value={formState.name}
            onChange={handleChange("name")}
            placeholder="Name"
            style={{}}
          />
        </div>
        {/* email */}
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="email">
            Email
          </label>
          <input
            required
            name="email"
            className="border border-black shadow-sm rounded border w-full mb-2  p-2"
            type="email"
            value={formState.email}
            onChange={handleChange("email")}
            placeholder="Email"
          />
        </div>
        {/* password */}
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="password">
            Password
          </label>
          <input
            required
            name="password"
            className="border border-black shadow-sm rounded border w-full mb-2  p-2"
            type="password"
            value={formState.password}
            onChange={handleChange("password")}
            placeholder="Password"
          />
        </div>
        {/* confirm password */}
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="password again">
            Confirm Password
          </label>
          <input
            required
            name="passwordAgain"
            className="border border-black shadow-sm rounded border w-full mb-2  p-2"
            type="password"
            value={formState.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Password again"
          />
        </div>
        {/* date of birth */}
        <div className="mb-2">
          {/* title */}
          <h3 className="font-bold">Date of Birth</h3>
          <div className="flex justify-between items-center">
            {/* day */}
            <div className="flex flex-col">
              <label htmlFor="day">Day</label>
              <select
                required
                className="border border-black p-1"
                name="day"
                value={formState.day}
                onChange={handleChange("day")}
              >
                <option value="">select</option>
                {lastDay > 0 &&
                  days
                    .slice(0, lastDay)
                    .map((day, index) => <option key={index}>{day}</option>)}
              </select>
            </div>
            {/* month */}
            <div className="flex flex-col">
              <label htmlFor="month">Month</label>
              <select
                required
                onChange={handleChange("month")}
                className="border border-black p-1"
                name="month"
                value={formState.month}
              >
                <option value="">select</option>
                <option value={31}>Janaury</option>
                <option value={29}>February</option>
                <option value={31}>March</option>
                <option value={30}>April</option>
                <option value={31}>May</option>
                <option value={30}>June</option>
                <option value={31}>July</option>
                <option value={31}>August</option>
                <option value={30}>September</option>
                <option value={31}>October</option>
                <option value={30}>November</option>
                <option value={31}>December</option>
              </select>
            </div>
            {/* year */}
            <div className="flex flex-col">
              <label htmlFor="year">Year</label>
              <select
                required
                className="border border-black p-1"
                name="year"
                value={formState.year}
                onChange={handleChange("year")}
              >
                <option value="">select</option>
                <option value="1940">1940</option>
                <option value="1941">1941</option>
                <option value="1942">1942</option>
                <option value="1943">1943</option>
                <option value="1944">1944</option>
                <option value="1945">1945</option>
                <option value="1946">1946</option>
                <option value="1947">1947</option>
                <option value="1948">1948</option>
                <option value="1949">1949</option>
                <option value="1950">1950</option>
                <option value="1951">1951</option>
                <option value="1952">1952</option>
                <option value="1953">1953</option>
                <option value="1954">1954</option>
                <option value="1955">1955</option>
                <option value="1956">1956</option>
                <option value="1957">1957</option>
                <option value="1958">1958</option>
                <option value="1959">1959</option>
                <option value="1960">1960</option>
                <option value="1961">1961</option>
                <option value="1962">1962</option>
                <option value="1963">1963</option>
                <option value="1964">1964</option>
                <option value="1965">1965</option>
                <option value="1966">1966</option>
                <option value="1967">1967</option>
                <option value="1968">1968</option>
                <option value="1969">1969</option>
                <option value="1970">1970</option>
                <option value="1971">1971</option>
                <option value="1972">1972</option>
                <option value="1973">1973</option>
                <option value="1974">1974</option>
                <option value="1975">1975</option>
                <option value="1976">1976</option>
                <option value="1977">1977</option>
                <option value="1978">1978</option>
                <option value="1979">1979</option>
                <option value="1980">1980</option>
                <option value="1981">1981</option>
                <option value="1982">1982</option>
                <option value="1983">1983</option>
                <option value="1984">1984</option>
                <option value="1985">1985</option>
                <option value="1986">1986</option>
                <option value="1987">1987</option>
                <option value="1988">1988</option>
                <option value="1989">1989</option>
                <option value="1990">1990</option>
                <option value="1991">1991</option>
                <option value="1992">1992</option>
                <option value="1993">1993</option>
                <option value="1994">1994</option>
                <option value="1995">1995</option>
                <option value="1996">1996</option>
                <option value="1997">1997</option>
                <option value="1998">1998</option>
                <option value="1999">1999</option>
                <option value="2000">2000</option>
                <option value="2001">2001</option>
                <option value="2002">2002</option>
                <option value="2003">2003</option>
                <option value="2004">2004</option>
                <option value="2005">2005</option>
                <option value="2006">2006</option>
                <option value="2007">2007</option>
                <option value="2008">2008</option>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>
        </div>
        {/* gender */}
        <div>
          <label className="font-bold" htmlFor="gender">
            Gender
          </label>
          <div className="flex gap-2">
            <label
              htmlFor="male"
              className="flex cursor-pointer justify-between p-2 flex-1 border border-gray-400"
            >
              <span>Male</span>
              <input
                onChange={handleChange("gender")}
                value="male"
                id="male"
                name="radio"
                type="radio"
                radiovalue="male"
                checked
              />
            </label>
            <label
              htmlFor="female"
              className="flex cursor-pointer justify-between p-2 flex-1 border border-gray-400"
            >
              <span>Female</span>
              <input
                onChange={handleChange("gender")}
                value="female"
                id="female"
                name="radio"
                type="radio"
                radiovalue="female"
              />
            </label>
          </div>
        </div>
        {/* signup button */}
        <div>
          {/* <button
              type="button"
              className="mt-2 inline-flex items-center flex justify-center px-3 py-1 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out bg-green-400 rounded w-full shadow cursor-not-allowed hover:bg-green-600"
              disabled=""
            >
              <svg
                className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing up...
            </button> */}

          <button
            className="mt-2 bg-green-600 shadow-sm rounded text-lg text-white px-3 py-1 w-full"
            type="submit"
          >
            Sign up
          </button>
        </div>
        {/* break */}
        <div className="my-5 flex justify-between gap-3 items-center">
          <hr className="flex-1" />
          <span>or</span>
          <hr className="flex-1" />
        </div>
        <div className="text-center">
          <Link className="text-blue-600 text-lg w-full underline" to="/">
            Log in
          </Link>
        </div>
      </form>
      {/* footer */}
      <footer className="m-2 text-center">Facebook-Clone &copy; 2022</footer>
    </div>
  );
};
