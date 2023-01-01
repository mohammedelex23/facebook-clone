export const DeletePrompt = () => {
  return (
    <div className="absolute p-5 top-[20%] left-[10%] z-3 w-[80%] h-[60%] border-2 shadow-md bg-white">
      <p>Delete post ?</p>
      <div className="absolute bottom-[10px] right-[10px]">
        <button className="ml-4 px-2 py-[1px] cursor-pointer text-white bg-gray-500 font-medium">
          Cansel
        </button>
        <button className="ml-4 px-2 py-[1px] cursor-pointer text-white bg-red-500 font-medium">
          Delete
        </button>
      </div>
    </div>
  );
};
