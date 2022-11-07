import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePollHorizontal,
  faUserGroup,
  faMagnifyingGlass,
  faMessage,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      {/* title */}
      <h1 className="py-2 tracking-wide bg-blue-600 font-bold  text-white text-center text-2xl">
        Facebook
      </h1>
      {/* navigation */}
      <ul className="flex justify-evenly border border-bottom-gray-1 gap-[20px] px-3 py-2">
        <li>
          <Link to="">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faSquarePollHorizontal}
              color="gray"
            />
          </Link>
        </li>
        <li>
          <Link to="">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faUserGroup}
              color="gray"
            />
          </Link>
        </li>
        <li>
          <Link to="">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faMagnifyingGlass}
              color="gray"
            />
          </Link>
        </li>
        <li>
          <Link to="">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faMessage}
              color="gray"
            />
          </Link>
        </li>
        <li>
          <Link to="">
            <FontAwesomeIcon
              className="text-[25px]"
              icon={faBars}
              color="gray"
            />
          </Link>
        </li>
      </ul>
    </div>
  );
};
