import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import userApi from "../api/userApi";
import authHelpers from "../helpers/authHelpers";
import { selectLocalUser } from "../redux/slices/localUserSlice";
import { UserProfile } from "./UserProfile";
export const FriendshipRequests = () => {
  let localUser = useSelector(selectLocalUser);
  if (Object.keys(localUser)) {
    localUser = authHelpers.getLocalUser();
  }
  const { data, isLoading } = useQuery("friendshipRequests", () =>
    userApi.getUserfriendshipRequests(localUser?._id, localUser?.token)
  );

  return (
    <div className="h-[70%] overflow-auto">
      <h2 className="font-medium mb-4">Friendship Requests</h2>
      {isLoading && <div className="text-center">Loading...</div>}
      {data?.length === 0 ? (
        <p className="text-center mt-1 text-sm">
          You don't have Friendship Requests yet
        </p>
      ) : (
        <ul>
          {data?.map((user) => (
            <UserProfile user={user} key={user._id} />
          ))}
        </ul>
      )}
    </div>
  );
};
