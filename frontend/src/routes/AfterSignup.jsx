export const AfterSignup = () => {
  return (
    <div>
      <h1 className="text-[2rem] text-center mt-4 font-bold text-blue-700 lg:text-[3rem]">
        Facebook
      </h1>
      <div className="w-[320px] md:w-[400px] bg-[#b9b7b7] mt-20 mx-auto px-3 py-4 rounded-sm">
        <h1 className="text-xl text-center font-bold mb-2">
          Account Verification
        </h1>
        <p>
          Please open your <strong>email and click the </strong>
          verification link to be able to use this website.
        </p>
        <p className="text-[#b72850] mb-1">
          <small>
            If yo didn't receive email click the button below &#x1F447;
          </small>
        </p>
        <div>
          <button className="block mx-auto bg-blue-600 text-white rounded-sm px-3 py-1">
            Resend mail
          </button>
        </div>
      </div>
    </div>
  );
};
