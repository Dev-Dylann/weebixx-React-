import React, { useEffect, useRef, useState} from 'react'
import Hls from 'hls.js';

const VideoPlayer = ({ streamLinks, streamQuality, poster }) => {
    const videoRef = useRef();
    const [streamUrl, setStreamUrl] = useState();

    useEffect(() => {
      const streamLink = streamLinks.find(link => {
        return link.quality === streamQuality;
      })

      console.log(streamLinks);

      setStreamUrl(streamLink?.url);
    }, [streamQuality, streamLinks])

    useEffect(() => {
        const loadVideo = () => {
            if (Hls.isSupported) {
              const hls = new Hls();
              hls.loadSource(streamUrl);
              hls.attachMedia(videoRef.current);
          
              return () => {
                hls.destroy();
              };
            } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
              videoRef.current.src = streamUrl;
            }
          };

          if (streamUrl) {
            loadVideo();
          }
    }, [streamUrl])

  return (
    <video controls poster={poster} ref={videoRef} className="w-full">
        <source src={streamUrl} type="application/x-mpegURL" />
    </video>
  )
}

export default VideoPlayer