import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="text-center pt-16">
      <h1 className="font-bold text-lg my-3">Oops!</h1>
      <p className=" my-3">Sorry, an unexpected error has occurred.</p>
      <p className="mb-2 text-gray-500">
        <i>{error.statusText || error.message}</i>
      </p>
      <div className="flex justify-center items-center gap-2 text-blue-500">
        <Link className="text-lg" to="/">
          return to home
        </Link>
        <FontAwesomeIcon icon={faRotateLeft} />
      </div>
    </div>
  );
}
