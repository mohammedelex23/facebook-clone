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
  const [lastDay, setLastDay] = useState(28);

  // form fileds states
  const [name, setName] = useState({
    value: "",
    error: "",
    style: {
      border: "1px solid black",
    },
  });
  const [email, setEmail] = useState({
    value: "",
    error: "",
    style: {
      border: "1px solid black",
    },
  });
  const [password, setPassword] = useState({
    value: "",
    error: "",
    style: {
      border: "1px solid black",
    },
  });
  const [passwordAgain, setPasswordAgain] = useState({
    value: "",
    error: "",
    style: {
      border: "1px solid black",
    },
  });

  const [day, setDay] = useState({
    value: "",
    style: {
      border: "1px solid black",
    },
  });
  const [month, setMonth] = useState({
    value: "",
    style: {
      border: "1px solid black",
    },
  });
  const [year, setYear] = useState({
    value: "",
    style: {
      border: "1px solid black",
    },
  });

  const [gender, setGender] = useState("male");
  const abortController = new AbortController();

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, [
    lastDay,
    name.value,
    name.style,
    name.error,
    email.value,
    email.style,
    password.value,
    password.style,
    passwordAgain.value,
    passwordAgain.style,
    day.value,
    day.style,
    month.value,
    month.style,
    year.value,
    year.style,
  ]);

  const handleChange = (type) => (e) => {
    switch (type) {
      case "name":
        setName({ ...name, value: e.target.value });
        break;
      case "email":
        setEmail({ ...email, value: e.target.value });
        break;
      case "password":
        setPassword({ ...password, value: e.target.value });
        break;
      case "passwordAgain":
        setPasswordAgain({ ...passwordAgain, value: e.target.value });
        break;
      case "day":
        setDay({ ...day, value: e.target.value });
        break;
      case "year":
        setYear({ ...year, value: e.target.value });
        break;
      case "gender":
        setGender(e.target.id);
        break;
      default:
        break;
    }
  };

  const handleMonthSelect = (e) => {
    let days = e.target.selectedOptions[0].getAttribute("days");
    setLastDay(days);
    setMonth({ ...month, value: e.target.value });
  };

  const handleOnBlur = (type) => (e) => {
    switch (type) {
      case "name":
        if (!name.value || (name.value && !name.value.trim())) {
          setName({
            ...name,
            style: {
              border: "1px solid red",
            },
            error: "Name is required",
          });
        } else {
          setName({
            ...name,
            style: {
              border: "1px solid black",
            },
            error: "",
          });
        }
        break;
      case "email":
        validateFormFields("email");
        if (!email.value || (email.value && !email.value.trim())) {
          setEmail({
            ...email,
            style: {
              border: "1px solid red",
            },
            error: "Email is required",
          });
        } else if (
          !new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(e.target.value)
        ) {
          setEmail({
            ...email,
            style: {
              border: "1px solid red",
            },
            error: "Invalid email",
          });
        } else {
          setEmail({
            ...email,
            style: {
              border: "1px solid black",
            },
            error: "",
          });
        }
        break;
      case "password":
        validateFormFields("password");
        if (!password.value || (password.value && !password.value.trim())) {
          setPassword({
            ...password,
            error: "Password is required",
            style: {
              border: "1px solid red",
            },
          });
        } else if (password.value.length < 8) {
          setPassword({
            ...password,
            error: "Password should be 8 characters at least",
            style: {
              border: "1px solid red",
            },
          });
        } else {
          setPassword({
            ...password,
            error: "",
            style: {
              border: "1px solid black",
            },
          });
        }
        break;
      case "passwordAgain":
        validateFormFields("passwordAgain");
        // validate password
        if (!password.value || (password.value && !password.value.trim())) {
          setPassword({
            ...password,
            error: "Password is required",
            style: {
              border: "1px solid red",
            },
          });
        } else if (password.value.length < 8) {
          setPassword({
            ...password,
            error: "Password should be 8 characters at least",
            style: {
              border: "1px solid red",
            },
          });
        }
        // validate passwordagain
        if (
          !passwordAgain.value ||
          (passwordAgain.value && !passwordAgain.value.trim())
        ) {
          setPasswordAgain({
            ...passwordAgain,
            error: "Password is required",
            style: {
              border: "1px solid red",
            },
          });
        } else if (passwordAgain.value.length < 8) {
          setPasswordAgain({
            ...passwordAgain,
            error: "Password should be 8 characters at least",
            style: {
              border: "1px solid red",
            },
          });
        } else if (
          passwordAgain.value.length > 8 &&
          password.value.length > 8 &&
          password.value !== passwordAgain.value
        ) {
          setPassword({
            ...password,
            error: "Password mismatch",
            style: {
              border: "1px solid red",
            },
          });
          setPasswordAgain({
            ...passwordAgain,
            error: "Password mismatch",
            style: {
              border: "1px solid red",
            },
          });
        } else {
          setPassword({
            ...password,
            error: "",
            style: {
              border: "1px solid black",
            },
          });
          setPasswordAgain({
            ...passwordAgain,
            error: "",
            style: {
              border: "1px solid black",
            },
          });
        }
        break;
      case "day":
        if (!day.value || (day.value && !day.value.trim())) {
          setDay({
            ...day,
            style: {
              border: "1px solid red",
            },
          });
        } else {
          setDay({
            ...day,
            style: {
              border: "1px solid black",
            },
          });
        }
        break;
      case "month":
        if (!month.value || (month.value && !month.value.trim())) {
          setMonth({
            ...month,
            style: {
              border: "1px solid red",
            },
          });
        } else {
          setMonth({
            ...month,
            style: {
              border: "1px solid black",
            },
          });
        }
        break;
      case "year":
        if (!year.value || (year.value && !year.value.trim())) {
          setYear({
            ...year,
            style: {
              border: "1px solid red",
            },
          });
        } else {
          setYear({
            ...year,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: name.value,
        email: email.value,
        password: password.value,
        dateOfBirth: new Date(`${month.value}-${day.value}-${year.value}`),
        gender,
      };
      await authApi.signup(data, abortController.signal);
    } catch (error) {}
  };

  // validate form fields
  const validateFormFields = (type) => {
    if (type === "email") {
      // validate name
      if (!name.value) {
        setName({
          ...name,
          style: {
            border: "1px solid red",
          },
          error: "Name is required",
        });
      }
    } else if (type === "password") {
      // validate name
      if (!name.value) {
        setName({
          ...name,
          style: {
            border: "1px solid red",
          },
          error: "Name is required",
        });
      }
      // validate email
      if (!email.value) {
        setEmail({
          ...email,
          style: {
            border: "1px solid red",
          },
          error: "Email is required",
        });
      } else if (
        !new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email.value)
      ) {
        setEmail({
          ...email,
          style: {
            border: "1px solid red",
          },
          error: "Invalid email",
        });
      }
    } else if (type === "passwordAgain") {
      // validate name
      if (!name.value) {
        setName({
          ...name,
          style: {
            border: "1px solid red",
          },
          error: "Name is required",
        });
      }
      // validate email
      if (!email.value) {
        setEmail({
          ...email,
          style: {
            border: "1px solid red",
          },
          error: "Email is required",
        });
      } else if (
        !new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email.value)
      ) {
        setEmail({
          ...email,
          style: {
            border: "1px solid red",
          },
          error: "Invalid email",
        });
      }
    }
  };

  return (
    <div className="p-7 relative bg-gray-200 h-[auto] overflow-auto">
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
            value={name.value}
            onChange={handleChange("name")}
            style={name.style}
            onBlur={handleOnBlur("name")}
            placeholder="Name"
          />
          {name.error && <ErrorComp error={name.error} />}
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
            type="text"
            value={email.value}
            onChange={handleChange("email")}
            style={email.style}
            onBlur={handleOnBlur("email")}
            placeholder="Email"
          />
          {email.error && <ErrorComp error={email.error} />}
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
            value={password.value}
            onChange={handleChange("password")}
            style={password.style}
            onBlur={handleOnBlur("password")}
            placeholder="Password"
          />
          {password.error && <ErrorComp error={password.error} />}
        </div>
        {/* password again */}
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="password again">
            Password again
          </label>
          <input
            required
            name="passwordAgain"
            className="border border-black shadow-sm rounded border w-full mb-2  p-2"
            type="password"
            value={passwordAgain.value}
            onChange={handleChange("passwordAgain")}
            style={passwordAgain.style}
            onBlur={handleOnBlur("passwordAgain")}
            placeholder="Password again"
          />
          {passwordAgain.error && <ErrorComp error={passwordAgain.error} />}
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
                value={day.value}
                onChange={handleChange("day")}
                style={day.style}
                onBlur={handleOnBlur("day")}
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
                onChange={handleMonthSelect}
                className="border border-black p-1"
                name="month"
                value={month.value}
                style={month.style}
                onBlur={handleOnBlur("month")}
              >
                <option value="">select</option>
                <option days={31} value="1">
                  Janaury
                </option>
                <option days={29} value="2">
                  February
                </option>
                <option days={31} value="3">
                  March
                </option>
                <option days={30} value="4">
                  April
                </option>
                <option days={31} value="5">
                  May
                </option>
                <option days={30} value="6">
                  June
                </option>
                <option days={31} value="7">
                  July
                </option>
                <option days={31} value="8">
                  August
                </option>
                <option days={30} value="9">
                  September
                </option>
                <option days={31} value="10">
                  October
                </option>
                <option days={30} value="11">
                  November
                </option>
                <option days={31} value="12">
                  December
                </option>
              </select>
            </div>
            {/* year */}
            <div className="flex flex-col">
              <label htmlFor="year">Year</label>
              <select
                required
                className="border border-black p-1"
                name="year"
                value={year.value}
                onChange={handleChange("year")}
                style={year.style}
                onBlur={handleOnBlur("year")}
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
                id="male"
                name="radio"
                type="radio"
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
                id="female"
                name="radio"
                type="radio"
              />
            </label>
          </div>
        </div>
        {/* signup button */}
        <div>
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
