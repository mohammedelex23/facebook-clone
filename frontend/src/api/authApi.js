const signup = async (data) => {
  try {
    let res = await fetch("http://localhost:5000/auth/signup", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (!res.ok) {
      res = await res.json();
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const login = async (data) => {
  try {
    let res = await fetch("http://localhost:5000/auth/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (!res.ok) {
      res = await res.json();
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const verifyUser = async (id) => {
  try {
    let res = await fetch(`http://localhost:5000/auth/signup/verify/${id}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (!res.ok) {
      res = await res.json();
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

export default { signup, login, verifyUser };
