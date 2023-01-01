import { useEffect } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useQuery } from "react-query";
import userApi from "../api/userApi";
import { SearchBox } from "../components/SearchBox";
import { SearchResults } from "../components/SearchResults";

export const Search = () => {
  useEffect(() => {});

  // SearchBox state
  const inputRef = useRef();
  // end SearchBox

  const { refetch, data, isFetching, isFetched } = useQuery({
    queryKey: "users",
    queryFn: () => userApi.getAllusers(inputRef.current.value.trim()),
    enabled: false,
  });

  let getSearchResults = useCallback(() => {
    return data;
  }, [data]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputRef.current.value || !inputRef.current.value?.trim()) {
      inputRef.current.value = "";
      inputRef.current.focus();
      return;
    }
    refetch();
  };

  return (
    <div className="px-4 py-2">
      <SearchBox
        handleSearch={handleSearch}
        inputRef={inputRef}
        refetch={refetch}
      />
      <SearchResults
        getSearchResults={getSearchResults}
        isFetching={isFetching}
        isFetched={isFetched}
      />
    </div>
  );
};
