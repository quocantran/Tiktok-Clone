import { useEffect, useState } from "react";
import Video from "../../../components/Video";
import request from "../../../ultis/request";
import Cookies from "js-cookie";

const ContentHomeItem = ({ muted, data, volumeValue }) => {
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
      followed={isFollowed}
      isLike={isLike}
      data={data}
    />
  );
};

export default ContentHomeItem;
