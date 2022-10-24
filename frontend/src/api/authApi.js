const signup = async (data, signal) => {
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
      signal,
    });
    if (!res.ok) {
      res = await res.json();
      throw res;
    }
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export default { signup };