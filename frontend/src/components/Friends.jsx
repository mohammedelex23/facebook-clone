import { useQuery } from "react-query";
import userApi from "../api/userApi";
import authHelpers from "../helpers/authHelpers";
import { UserProfile } from "./UserProfile";
import { useSelector } from "react-redux";
import { selectLocalUser } from "../redux/slices/localUserSlice";
export const Friends = () => {
  let localUser = useSelector(selectLocalUser);

  if (Object.keys(localUser)) {
    localUser = authHelpers.getLocalUser();
  }
  const { data, isLoading } = useQuery("friends", () =>
    userApi.getUserFriends(localUser?._id, localUser?.token)
  );

  return (
    <div className="h-[70%] overflow-auto">
      <h2 className="font-medium mb-4">Friends</h2>
      {isLoading && <div className="text-center">Loading...</div>}
      {data?.length === 0 ? (
        <p className="text-center mt-1 text-sm">You don't have friends yet </p>
      ) : (
        <ul>
          {data?.map((user) => (
            <UserProfile btnType="remove" user={user} key={user._id} />
          ))}
        </ul>
      )}
    </div>
  );
};
