import { useEffect, useState } from "react";
import Video from "../../../components/Video";

const FollowingContent = ({ muted, data, volumeValue }) => {
  const [isLike, setIsLike] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  useEffect(() => {
    setIsLike(data.is_liked);
    setIsFollowed(data.user.is_followed);
  }, []);

  return (
    <Video
      volumeValue={volumeValue}
      muted={muted}
      followingPage={true}
      followed={isFollowed}
      isLike={isLike}
      data={data}
    />
  );
};

export default FollowingContent;
