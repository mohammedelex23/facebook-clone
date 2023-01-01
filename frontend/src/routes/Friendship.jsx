import { Friends } from "../components/Friends";
import { FriendshipRequests } from "../components/FriendshipRequests";

export const Friendship = () => {
  return (
    <div className="px-4 py-2 flex flex-col h-[78vh] gap-[10px]">
      {/* friendship requests */}
      <FriendshipRequests />
      <Friends />
    </div>
  );
};
