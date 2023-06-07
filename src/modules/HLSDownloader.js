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

    const segmentPromises = segments.map((segment) => axios.get(segment.uri));
    const segmentResponses = await Promise.all(segmentPromises);
    const segmentData = segmentResponses.map((response) => response.data);

    const initSegment = segmentData[0];
    const segmentByteArrays = segmentData
      .slice(1)
      .map((segment) => new Uint8Array(segment));

    const codec = "avc1.42E01E";
    const mime = `video/mp4; codecs="${codec}"`;

    const mp4Data = muxjs.mp4.tools.concatenateInitSegment(
      new Uint8Array(initSegment),
      segmentByteArrays,
      { mimeType: mime }
    );

    const blob = new Blob([mp4Data], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "video.mp4";
    link.click();
  } catch (err) {
    console.error(err);
  }
};

export default HlsDownloader;
