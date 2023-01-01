import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import authHelpers from "../helpers/authHelpers";
import { selectLocalUser } from "../redux/slices/localUserSlice";
import { ResultsItem } from "./ResultsItem";

export const SearchResults = ({ getSearchResults, isFetching, isFetched }) => {
  const [searchResults, setSearchResults] = useState([]);
  let localUser = useSelector(selectLocalUser);

  if (Object.keys(localUser)) {
    localUser = authHelpers.getLocalUser();
  }

  useEffect(() => {
    let data = getSearchResults();
    data = data?.filter((item) => item._id !== localUser._id);
    setSearchResults(data);
  }, [isFetching]);

  return (
    <>
      {isFetching && <div>Loading...</div>}
      {isFetched && searchResults?.length === 0 && <p>Nothing is found</p>}
      {searchResults?.length > 0 && (
        <div className="bg-white p-3">
          {searchResults.map((item) => (
            <ResultsItem key={item._id} user={item} />
          ))}
        </div>
      )}
    </>
  );
};
