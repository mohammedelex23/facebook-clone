const getUser = async (userId) => {
  try {
    let res = await fetch(`/api/users/${userId}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
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

export default { getUser };
