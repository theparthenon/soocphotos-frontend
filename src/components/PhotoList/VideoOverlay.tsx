import { Duration } from "luxon";
import React from "react";

import { MediaType } from "@/@types/photos";

type Props = Readonly<{
  item: {
    type: MediaType;
    video_length: string;
  };
}>;

export function VideoOverlay({ item }: Props) {

  function getDuration({ video_length }) {
    return <span className="videoDuration">{Duration.fromObject({ seconds: video_length }).toFormat("mm:ss")}</span>;
  }

  if (![MediaType.VIDEO].includes(item.type)) {
    return <div />;
  }

  return (
    <div className="videoContainer">
      {item.video_length && item.video_length !== "None" && getDuration(item)}
    </div>
  );
}
