import axios from "axios";
import muxjs from "mux.js";
import { Parser } from "m3u8-parser";

const HlsDownloader = async (streamUrl, episodeName) => {
  try {
    const response = await axios.get(streamUrl);

    const parser = new Parser();
    parser.push(response.data);
    parser.end();

    const { segments } = parser.manifest;

    const segmentBase = streamUrl.slice(0, streamUrl.indexOf("ep."));

    const segmentURIs = segments.map((segment) => {
      return segmentBase + segment.uri;
    });

    const video = document.createElement("video");
    let transmuxer = new muxjs.mp4.Transmuxer();
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);

    const mime = 'video/mp4; codecs="mp4a.40.2,avc1.64001f"';

    mediaSource.addEventListener("sourceopen", () => {
      if (segmentURIs.length == 0) {
        return;
      }

      URL.revokeObjectURL(video.src);
      let sourceBuffer = mediaSource.addSourceBuffer(mime);

      sourceBuffer.addEventListener("updateend", () => {
        transmuxer.off("data");
        transmuxer.on("data", (segment) => {
          sourceBuffer.appendBuffer(new Uint8Array(segment.data));
        });

        if (segmentURIs.length == 0) {
          // notify MSE that we have no more segments to append.
          mediaSource.endOfStream();
        }

        segmentURIs.forEach((segment) => {
          // fetch the next segment from the segments array and pass it into the transmuxer.push method
          fetch(segmentURIs.shift())
            .then((response) => {
              return response.arrayBuffer();
            })
            .then((response) => {
              transmuxer.push(new Uint8Array(response));
              transmuxer.flush();
            });
        });
      });

      transmuxer.on("data", (segment) => {
        let data = new Uint8Array(
          segment.initSegment.byteLength + segment.data.byteLength
        );
        data.set(segment.initSegment, 0);
        data.set(segment.data, segment.initSegment.byteLength);
        console.log(muxjs.mp4.tools.inspect(data));
        sourceBuffer.appendBuffer(data);
      });

      fetch(segments.shift())
        .then((response) => {
          return response.arrayBuffer();
        })
        .then((response) => {
          transmuxer.push(new Uint8Array(response));
          transmuxer.flush();
        });
    });

    /*  const blob = new Blob([mp4Data], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "video.mp4";
    link.click(); */
  } catch (err) {
    console.error(err);
  }
};

const appendFirstSegment = (segments) => {
  if (segments.length == 0) {
    return;
  }

  URL.revokeObjectURL(video.src);
  sourceBuffer = mediaSource.addSourceBuffer(mime);
  sourceBuffer.addEventListener("updateend", appendNextSegment);

  transmuxer.on("data", (segment) => {
    let data = new Uint8Array(
      segment.initSegment.byteLength + segment.data.byteLength
    );
    data.set(segment.initSegment, 0);
    data.set(segment.data, segment.initSegment.byteLength);
    console.log(muxjs.mp4.tools.inspect(data));
    sourceBuffer.appendBuffer(data);
  });

  fetch(segments.shift())
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((response) => {
      transmuxer.push(new Uint8Array(response));
      transmuxer.flush();
    });
};

export default HlsDownloader;
