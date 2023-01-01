import { useState } from "react";
import configs from "../../api/configs";
import authHelpers from "../../helpers/authHelpers";

export const useApi = () => {
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);

  const makeApiCall = async (url, obj) => {
    let localUser = authHelpers.getLocalUser();
    try {
      // before fetch
      setIsLoading(true);
      setDisabled(true);

      setData(null);
      setIsError(false);

      let res = await fetch(url, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + localUser.token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ ...obj, userId: localUser._id }),
      });
      if (!res.ok) {
        res = await res.json();
        throw res;
      } else {
        res = await res.json();

        // after fetch succeed
        setIsLoading(false);
        setDisabled(false);
        setIsError(false);

        setData(res);
        return res;
      }
    } catch (error) {
      setIsLoading(false);
      setDisabled(false);
      setData(null);

      setIsError(true);
      throw error;
    }
  };

  return { disabled, isLoading, isError, data, makeApiCall };
};
