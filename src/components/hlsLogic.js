import { useState, useEffect, useRef } from "react";
import api from "./api/test";
import Hls from "hls.js";

function App() {
  const [streamLink, setStreamLink] = useState(``);
  const videoRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "/anime/gogoanime/watch/naruto-episode-1"
        );
        console.log(response.data);
        setStreamLink(response.data.sources[4].url);
      } catch (err) {
        console.log(err.response);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Hls.isSupported) {
      const hls = new Hls();
      hls.loadSource(streamLink);
      hls.attachMedia(videoRef.current);
      /*       hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      }); */

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamLink;
      /* videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
      }) */
    }
  }, [streamLink]);

  const downloadVideo = () => {
    const hls = new Hls();
    hls.loadSource(streamLink);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const anchor = document.createElement("a");
      const blob = new Blob([videoRef.current.src], { type: "video/mp4" });
      const objectUrl = URL.createObjectURL(blob);
      anchor.href = objectUrl;
      anchor.download = "weebixx-episode-1(360p)";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    });
  };

  return (
    <div className="w-2/3 mx-auto py-16 flex flex-col gap-8 items-center">
      <video controls ref={videoRef} className="w-full">
        <source src={streamLink} type="application/x-mpegURL" />
      </video>

      <button
        onClick={downloadVideo}
        className="bg-blue-600 text-white font-nunito py-2 px-6 rounded-lg shadwow-lg"
      >
        Download
      </button>
    </div>
  );
}

export default App;
