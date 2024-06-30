import React, { forwardRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

import getImageHeight from "../../utils/getImageHeight";
import getTileMeasurements from "../../utils/getTileMeasurements";
import styles from "./styles.module.css";

interface TileProps {
  item: {
    id: string;
    dominantColor: string;
    isTemp: boolean;
    url: string;
    type: string;
    style: {
      height: number;
      width: number;
      translateX: number;
      translateY: number;
    };
  };
  useLqip: boolean;
  containerWidth: number;
  containerOffsetTop: number;
  getUrl: Function;
  activeTileUrl: string;
  handleClick: Function;
  handleSelection: Function;
  selected: boolean;
  selectable: boolean;
  windowHeight: number;
  scrollSpeed: string;
  settings: {
    gridGap: number;
    bgColor: string;
    thumbnailSize: number;
    expandedSize: number;
  };
  toprightoverlay: any;
  bottomleftoverlay: any;
}

const Tile = forwardRef<HTMLButtonElement, TileProps>((props) => {
    const isTemp = !!props.item.isTemp;
    const isSelectable = props.selectable;
    const isSelected = props.selected;
    const isExpanded = props.activeTileUrl === props.item.url;
    const isVideo =
      !isTemp &&
      (props.item.url.includes(".mp4") ||
      props.item.url.includes(".mov") ||
        (props.item.type !== undefined && props.item.type.includes("video")));
    const [isFullSizeLoaded, setFullSizeLoaded] = useState(!!isVideo);
    const TopRightOverlay = props.toprightoverlay;
    const BottomLeftOverlay = props.bottomleftoverlay;

    const { calcWidth, calcHeight, offsetX, offsetY } = getTileMeasurements({
      item: props.item,
      windowHeight: props.windowHeight,
      settings: props.settings,
      containerWidth: props.containerWidth,
      containerOffsetTop: props.containerOffsetTop,
    });

    // gridPosition is what has been set by the grid layout logic (in the parent component)
    const gridPosition = `translate3d(${props.item.style.translateX}px, ${props.item.style.translateY}px, 0)`;
    // screenCenter is positioning logic for when the item is active and expanded
    const screenCenter = `translate3d(${offsetX}px, ${offsetY}px, 0)`;

    function getWidth(exp, sel) {
      if (exp) {
        return `${Math.ceil(calcWidth)}px`;
      }
      if (sel) {
        return `${props.item.style.width - props.item.style.width * 0.1}px`;
      }
      return `${props.item.style.width}px`;
    }

    function getHeight(exp, sel) {
      if (exp) {
        return `${Math.ceil(calcHeight)}px`;
      }
      if (sel) {
        return `${props.item.style.height - props.item.style.height * 0.1}px`;
      }
      return `${props.item.style.height}px`;
    }

    const { width, height, transform, zIndex, marginLeft, marginRight, marginTop, marginBottom } = useSpring({
      transform: isExpanded ? screenCenter : gridPosition,
      zIndex: isExpanded ? 10 : 0, // 10 so that it takes a little longer before settling at 0
      width: getWidth(isExpanded, isSelected),
      height: getHeight(isExpanded, isSelected),
      marginLeft: isSelected && !isExpanded ? props.item.style.width * 0.05 : 0,
      marginRight: isSelected && !isExpanded ? props.item.style.width * 0.05 : 0,
      marginTop: isSelected && !isExpanded ? props.item.style.height * 0.05 : 0,
      marginBottom: isSelected && !isExpanded ? props.item.style.height * 0.05 : 0,
      config: { mass: 1.5, tension: 400, friction: 40 },
    });

    return (
      <animated.button
        className={`${styles.pigBtn}${isExpanded ? ` ${styles.pigBtnActive}` : ""} pig-btn`}
        onClick={event => props.handleClick(event, props.item)}
        style={{
          outline: isExpanded ? `${props.settings.gridGap}px solid ${props.settings.bgColor}` : 0,
          backgroundColor: props.item.dominantColor,
          zIndex: zIndex.to(t => Math.round(t)),
          width: width.to(t => t),
          height: height.to(t => t),
          marginLeft: marginLeft.to(t => t),
          marginRight: marginRight.to(t => t),
          marginTop: marginTop.to(t => t),
          marginBottom: marginBottom.to(t => t),
          transform: transform.to(t => t),
        }}
      >
        {props.useLqip && !isTemp && (
          // LQIP
          <img
            className={`${styles.pigImg} ${styles.pigThumbnail}${
              isFullSizeLoaded ? ` ${styles.pigThumbnailLoaded}` : ""
            }`}
            src={props.getUrl(props.item.url, props.settings.thumbnailSize) as string}
            loading="lazy"
            alt=""
          />
        )}

        {props.scrollSpeed === "slow" && !isVideo && !isTemp && (
          // grid image
          <img
            className={`${styles.pigImg} ${styles.pigFull}${isFullSizeLoaded ? ` ${styles.pigFullLoaded}` : ""}`}
            src={props.getUrl(props.item.url, getImageHeight(props.containerWidth)) as string}
            alt=""
            onLoad={() => setFullSizeLoaded(true)}
          />
        )}

        {props.scrollSpeed === "slow" && isVideo && !isTemp && (
          <video
            className={`${styles.pigImg} ${styles.pigThumbnail}${
              isFullSizeLoaded ? ` ${styles.pigThumbnailLoaded}` : ""
            }`}
            src={props.getUrl(props.item.url, getImageHeight(props.containerWidth)) as string}
            onCanPlay={() => setFullSizeLoaded(true)}
            onMouseOver={(event: React.MouseEvent<HTMLVideoElement>) => event.target.play()}
            onFocus={(event: React.FocusEvent<HTMLVideoElement>) => event.target.play()}
            onMouseOut={(event: React.MouseEvent<HTMLVideoElement>) => event.target.pause()}
            onBlur={(event: React.FocusEvent<HTMLVideoElement>) => event.target.pause()}
            muted
            loop
            playsInline
          />
        )}

        {isExpanded && !isVideo && !isTemp && (
          // full size expanded image
          <img className={styles.pigImg} src={props.getUrl(props.item.url, props.settings.expandedSize) as string} alt="" />
        )}

        {isExpanded && isVideo && !isTemp && (
          // full size expanded video
          <video
            className={styles.pigImg}
            src={props.getUrl(props.item.url, props.settings.expandedSize) as string}
            onMouseOver={event => event.target.play()}
            onFocus={event => event.target.play()}
            onMouseOut={event => event.target.pause()}
            onBlur={event => event.target.pause()}
            muted
            loop
            playsInline
          />
        )}
        <div>
          <div className={styles.overlaysTopLeft}>
            {isSelectable && (
              <input
                key={props.item.id + isSelected}
                type="checkbox"
                className={styles.checkbox}
                defaultChecked={isSelected}
                onClick={event => {
                  event.stopPropagation();
                  props.handleSelection(props.item);
                }}
              />
            )}
          </div>
          <div className={styles.overlaysTopRight}>{TopRightOverlay && <TopRightOverlay item={props.item} />}</div>
          <div className={styles.overlaysBottomLeft}>{BottomLeftOverlay && <BottomLeftOverlay item={props.item} />}</div>
        </div>
      </animated.button>
    );
  }
);

export default Tile;
