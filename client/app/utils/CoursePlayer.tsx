import { useEffect, useState } from "react";
import axios from "axios";

type CoursePlayerProps = {
  videoUrl: string;
  title: string;
};

const CoursePlayer = ({ videoUrl, title }: CoursePlayerProps) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    axios
      .post<{ otp: string; playbackInfo: string }>(
        "http://localhost:8000/api/v1/getVdoCipherOTP",
        {
          videoId: videoUrl,
        }
      )
      .then((res) => {
        setVideoData(res.data);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, [videoUrl]);

  return (
    <div
      style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}
    >
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          title={title || "Course video player"}
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=q6nWRv08dU1EIIRC`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        />
      )}
    </div>
  );
};

export default CoursePlayer;
