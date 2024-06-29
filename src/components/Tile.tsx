import type { CSSProperties, MouseEventHandler } from "react";
import React from "react";

import { Image } from "@mantine/core";

import { serverAddress } from "@/api/apiClient";

type Props = {
  width: number;
  height: number;
  image_hash: string;
  style?: CSSProperties;
  video: boolean;
  onClick?: (e: MouseEventHandler<HTMLElement>) => void;
};

export function Tile({ video = false, width, height, style = {}, image_hash }: Props) {
  if (video) {
    return (
      <video
        width={width}
        height={height}
        style={style}
        src={`${serverAddress}/media//${image_hash}`}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return (
    <Image style={style} width={width} height={height} src={`${serverAddress}/media/thumbnails/${image_hash}`} />
  );
}
