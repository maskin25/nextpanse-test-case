import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";

interface SubtitleRaw {
  [key: string]: { color: string; time: number };
}

const subtitles: SubtitleRaw[] = [
  {
    "Here are the 15 things that I wish I knew before": {
      color: "red",
      time: 0.2,
    },
  },
  {
    "I started my own business. I've been in business for": {
      color: "#ffffff",
      time: 3.7,
    },
  },
  {
    "myself now for quite some time and my": {
      color: "green",
      time: 6.8,
    },
  },
  {
    "current business the big one. I started two and a half years": {
      color: "#ffffff",
      time: 9.9,
    },
  },
  ,
  {
    "ago and over those years. I've taken notes in my phone": {
      color: "blue",
      time: 13.2,
    },
  },
  {
    "literally of the things. I wish I knew and": {
      color: "#ffffff",
      time: 16.6,
    },
  },
  {
    "now I'm ready to finally share them.": {
      color: "#ffffff",
      time: 20.5,
    },
  },
  ,
  {
    "These are the 15 key Secrets": {
      color: "#ffffff",
      time: 22.4,
    },
  },
  {
    "notes ideas and strategies. That": {
      color: "#ffffff",
      time: 26.7,
    },
  },
  ,
  {
    "are so important for me now.": {
      color: "#ffffff",
      time: 30.6,
    },
  },
  {
    "I wish someone had given them to me when I first": {
      color: "#ffffff",
      time: 33,
    },
  },
  ,
  {
    "became a CEO when I first started building a business": {
      color: "#ffffff",
      time: 36.3,
    },
  },
  {
    "bigger than myself.": {
      color: "#ffffff",
      time: 39.7,
    },
  },
] as SubtitleRaw[];

interface Subtitle {
  text: string;
  time: number;
  color: string;
}

function normalizeSubtitles(subtitles: SubtitleRaw[]): Subtitle[] {
  return subtitles.reduce((memo: Subtitle[], item) => {
    const key = Object.keys(item as object)[0];
    const existing = memo.find((i) => i.time === item[key].time);
    if (existing) {
      existing.text += " " + key;
    } else {
      memo.push({
        text: key,
        time: item[key].time,
        color: item[key].color,
      });
    }
    return memo;
  }, []);
}

export default function VideoPage() {
  const [subtitlesNormalized] = useState(normalizeSubtitles(subtitles));
  const [currentTime, setCurrentTime] = useState(0);
  const [ended, setEnded] = useState(false);

  // to render multiple videos, worth considering using canvas for that
  const [videoTracks] = useState([
    { src: "/15 Business Secrets Every CEO Should Know.mp4" },
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const subtitlesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    videoRef.current?.addEventListener("timeupdate", (event) => {
      setEnded(false);
      setCurrentTime(videoRef.current?.currentTime as number);
    });
    videoRef.current?.addEventListener("ended", (event) => {
      setEnded(true);
    });
  }, []);

  // stub to export video with captions, information needed on where the subtitles will be exported
  const onExportClick = async () => {
    /*  try {
      const response = await fetch("/api/export-video-with-captions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video: videoTracks,
          subtitles: subtitlesNormalized,
        }),
      });

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    } */
  };

  const subtitle = useMemo(() => {
    var closest = subtitlesNormalized.reduce((memo, item) => {
      if (item.time < currentTime && item.time > memo.time) {
        return item;
      }
      return memo;
    });

    return !ended && closest.time < currentTime ? closest : undefined;
  }, [currentTime, ended]);

  useEffect(() => {
    document.getSelection()?.removeAllRanges();

    const node = subtitlesRef.current;
    if (node && subtitle) {
      const index = subtitlesNormalized.indexOf(subtitle);
      const range = document.createRange();
      const element = node.childNodes[index];
      range.selectNodeContents(element);
      window.getSelection()?.addRange(range);
    }
  }, [subtitle]);

  return (
    <div className={"root"}>
      <div className={"videoEditor"}>
        <div ref={subtitlesRef} className={"captions"}>
          {subtitlesNormalized.map((subtitle) => (
            <span className={"caption"} style={{ color: subtitle.color }}>
              {subtitle.text}
            </span>
          ))}
        </div>
        <div className={"videoContainer"}>
          {videoTracks.map(({ src }) => (
            <video
              ref={videoRef}
              controls
              playsInline
              className={"video"}
              preload="metadata"
              src={src}
            />
          ))}

          <div
            className={"subtitlesOverlay"}
            style={{ color: subtitle?.color }}
          >
            {subtitle?.text}
          </div>
        </div>
      </div>
      {/* <button onClick={onExportClick}>Export</button> */}
    </div>
  );
}
