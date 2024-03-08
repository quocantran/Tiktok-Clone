import { useEffect, useState } from "react";
import Video from "../../../components/Video";
import request from "../../../ultis/request";
import Cookies from "js-cookie";

const FollowingContent = ({ muted, data, volumeValue }) => {
  const [isLike, setIsLike] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  useEffect(() => {
    async function getLike() {
      try {
        const res = await request.get(`/videos/${data.id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        });
        setIsLike(res.data.data.is_liked);
      } catch (err) {}
    }
    getLike();

    request
      .get(`/users/@${data.user.nickname}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      })
      .then((res) => {
        setIsFollowed(res.data.data.is_followed);
      });
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
