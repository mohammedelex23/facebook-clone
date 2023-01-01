import "./PostOptions.css";

export const PostOptions = ({ id }) => {
  const handleDeletePost = (e) => {};

  return (
    <ul
      id={id}
      postoption="something"
      style={{ visibility: "hidden" }}
      className="options font-medium w-[100px] absolute top-[30px] right-3 bg-white z-2"
    >
      <li postoption="something" className="p-1 cursor-pointer mb-1">
        Edit
      </li>
      <li
        onClick={handleDeletePost}
        postoption="something"
        className="p-1 cursor-pointer text-red-500 text-sm"
      >
        Delete
      </li>
    </ul>
  );
};
