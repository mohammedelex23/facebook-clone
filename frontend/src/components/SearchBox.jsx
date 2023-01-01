export const SearchBox = ({ handleSearch, inputRef, searchText, refetch }) => {
  const handeChange = (e) => {
    let searchInput = inputRef.current.value?.trim();
    if (searchInput.length > 0 && searchInput.length % 3 === 0) {
      refetch();
    }
  };
  return (
    <div className="mb-2 ">
      <form
        onSubmit={handleSearch}
        className="flex items-center p-3 bg-white"
        action=""
        method="post"
      >
        <input
          className="block bg-slate-100 mr-2 px-2 py-1 border border-black  rounded border w-[80%]"
          type="text"
          placeholder="Name, Email..."
          onChange={handeChange}
          ref={inputRef}
        />
        <button
          type="submit"
          className="block w-[20%] shadow-sm p-1 rounded bg-blue-600 text-white "
        >
          Search
        </button>
      </form>
    </div>
  );
};
