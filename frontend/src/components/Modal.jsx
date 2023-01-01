export default ({message,func,setOpenModal}) => {
    return <div className="flex justify-center  absolute w-[100%] z-10 h-[100%] bg-black/50 top-0 left-0">
        <div className="bg-white w-[70%] p-[20px] mt-[60%] h-fit">
            <p className="mb-2 text-red-600">{message}</p>
            <div className="flex gap-2 justify-end">
                <button
                onClick={() => setOpenModal(false)}
                 className="bg-gray-400 text-white px-2"
                >Cancel</button>
                <button
                onClick={func}
                className="bg-blue-600 w-[70px] text-white px-2"
                >Confirm</button>
            </div>
        </div>
    </div>
}