import { Box, Group } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useSetPersonAlbumCoverMutation } from "@/api/endpoints/albums/people";
import { useSetUserAlbumCoverMutation } from "@/api/endpoints/albums/user";
import { serverAddress } from "@/api/apiClient";
import { photoDetailsApi } from "@/api/endpoints/photos/photoDetail";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { TOP_MENU_HEIGHT } from "@/constants/ui.constant";
import { formatDateForPhotoGroups } from "@/utils/utils";
import { ModalAlbumEdit } from "@/components/Modals/ModalAlbumEdit";
import { LightBox } from "@/components/Lightbox/Lightbox";
import Pig from "@/components/ReactPig";
import { ScrollScrubber } from "@/components/ScrollScrubber";
import { useScrollLock } from "@/components/UseScrollLock/UseScrollLock";
import { ScrollerType } from "@/@types/scrollScrubber";
import type { IScrollerData } from "@/@types/scrollScrubber";
import { DefaultHeader } from "./DefaultHeader";
import { FavoritedOverlay } from "./FavoritedOverlay";
import { SelectionActions } from "./SelectionActions";
import { SelectionBar } from "./SelectionBar";
import { TrashcanActions } from "./TrashcanActions";
import { VideoOverlay } from "./VideoOverlay";

const TIMELINE_SCROLL_WIDTH = 0;

type Props = Readonly<{
  title: string;
  loading: boolean;
  icon: any;
  photoset: any[];
  idx2hash: any[];
  selectable: boolean;
  numberOfItems?: number;
  updateGroups?: any;
  updateItems?: any;
  date?: any;
  dayHeaderPrefix?: any;
  header?: any;
  additionalSubHeader?: any;
}>;

type SelectionState = {
  selectedItems: any[];
  selectMode: boolean;
};

function PhotoListViewComponent(
  {
    title = "",
    loading = false,
    icon = "",
    photoset = [],
    idx2hash = [],
    selectable = false,
    numberOfItems = 0,
    updateGroups = "",
    updateItems = "",
    date = "",
    dayHeaderPrefix = "",
    header = "",
    additionalSubHeader = ""
  }: Props) {
  const { height } = useViewportSize();
  const pigRef = useRef<Pig>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(1);
  const [lightboxImageId, setLightboxImageId] = useState("");
  const [lightboxShow, setLightboxShow] = useState(false);
  const [modalAddToAlbumOpen, setModalAddToAlbumOpen] = useState(false);
  const [selectionState, setSelectionState] = useState<SelectionState>({ selectedItems: [], selectMode: false });
  const selectionStateRef = useRef(selectionState);
  const [dataForScrollIndicator, setDataForScrollIndicator] = useState<IScrollerData[]>([]);
  const gridHeight = useRef(200);
  const setScrollLocked = useScrollLock(false)[1];
  const [setUserAlbumCover] = useSetUserAlbumCoverMutation();
  const [setPersonAlbumCover] = useSetPersonAlbumCoverMutation();

  const route = useAppSelector(store => store.router);

  const isDateView = photoset !== idx2hash;
  const photos = isDateView ? formatDateForPhotoGroups(photoset) : photoset;

  const idx2hashRef = useRef(idx2hash);
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    idx2hashRef.current = idx2hash;
  }, [idx2hash]);

  const throttledUpdateGroups = useCallback(
    _.throttle(visibleItems => updateGroups(visibleItems), 500),
    []
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const throttledUpdateItems = useCallback(
    _.throttle(visibleItems => updateItems(visibleItems), 500),
    []
  );

  const getUrl = useCallback((url: string, pxHeight: number) => {
    if (pxHeight < 250) {
      return `${serverAddress}/media/thumbnails/${url.split(";")[0]}`;
    }
    return `${serverAddress}/media/thumbnails/${url.split(";")[0]}`;
  }, []);

  const updateSelectionState = (newState: { selectedItems: any[]; selectMode: boolean }) => {
    const updatedState = { ...selectionState, ...newState };
    selectionStateRef.current = updatedState;
    setSelectionState(updatedState);
  };

  const handleSelection = (item: { id: string }) => {
    let newSelectedItems = selectionStateRef.current.selectedItems;

    if (newSelectedItems.find(selectedItem => selectedItem.id === item.id)) {
      newSelectedItems = newSelectedItems.filter(value => value.id !== item.id);
    } else {
      newSelectedItems = newSelectedItems.concat(item);
    }

    updateSelectionState({
      selectedItems: newSelectedItems,
      selectMode: newSelectedItems.length > 0,
    });
  };

  const handleSelections = (items: any[]) => {
    let newSelectedItems = selectionStateRef.current.selectedItems;
    items.forEach(item => {
      if (newSelectedItems.find(selectedItem => selectedItem.id === item.id)) {
        newSelectedItems = newSelectedItems.filter(value => value.id !== item.id);
      } else {
        newSelectedItems = newSelectedItems.concat(item);
      }
    });
    updateSelectionState({
      selectedItems: newSelectedItems,
      selectMode: newSelectedItems.length > 0,
    });
  };

  const getDataForScrollIndicator = (): IScrollerData[] => {
    const scrollPositions: IScrollerData[] = [];
    if (pigRef.current) {
      // @ts-ignore
      pigRef.current.imageData.forEach((group: DatePhotosGroupSchema) => {
        scrollPositions.push({
          label: group.date,
          targetY: group.groupTranslateY,
          year: group.year,
          month: group.month,
        });
      });
    }
    return scrollPositions;
  };

  useEffect(() => {
    if (!loading && pigRef.current) {
      setDataForScrollIndicator(getDataForScrollIndicator());
      // @ts-ignore
      gridHeight.current = pigRef.current.totalHeight;
    }
    // @ts-ignore
  }, [loading, pigRef.current?.totalHeight]);

  const scrollToY = (y: number) => {
    window.scrollTo(0, y);
  };

  const handleClick = (event: React.KeyboardEvent, item: { id: string }) => {
    // if an image is selectable, then handle shift click
    if (selectable && event.shiftKey) {
      const lastSelectedElement = selectionStateRef.current.selectedItems.at(-1);
      if (lastSelectedElement === undefined) {
        handleSelection(item);
        return;
      }
      const indexOfCurrentlySelectedItem = idx2hashRef.current.findIndex(image => image.id === item.id);
      const indexOfLastSelectedItem = idx2hashRef.current.findIndex(image => image.id === lastSelectedElement.id);

      if (indexOfCurrentlySelectedItem > indexOfLastSelectedItem) {
        handleSelections(idx2hashRef.current.slice(indexOfLastSelectedItem + 1, indexOfCurrentlySelectedItem + 1));
        return;
      }
      handleSelections(idx2hashRef.current.slice(indexOfCurrentlySelectedItem, indexOfLastSelectedItem));
      return;
    }
    if (selectionStateRef.current.selectMode) {
      handleSelection(item);
      return;
    }

    const index = idx2hashRef.current.findIndex(image => image.id === item.id);
    setLightboxImageIndex(index);
    setLightboxImageId(item.id);
    setLightboxShow(index >= 0);
    setScrollLocked(true);
  };

  const getPhotoDetails = (image: string) => {
    dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image));
  };

  const closeLightboxIfImageIndexIsOutOfSync = () => {
    if (
      lightboxShow &&
      (idx2hashRef.current.length <= lightboxImageIndex ||
        lightboxImageId !== idx2hashRef.current[lightboxImageIndex].id)
    ) {
      setScrollLocked(false);
      setLightboxShow(false);
    }
  };

  const getNumPhotos = () => (idx2hashRef.current ? idx2hashRef.current.length : 0);

  closeLightboxIfImageIndexIsOutOfSync();

  return (
    <div>
      <Box className="photoListBox">
        {header || (
          <DefaultHeader
            // @ts-ignore
            route={route}
            // @ts-ignore
            photoList={this}
            loading={loading}
            numPhotosetItems={photos.length || 0}
            numPhotos={getNumPhotos()}
            icon={icon}
            title={title}
            dayHeaderPrefix={dayHeaderPrefix}
            date={date}
            additionalSubHeader={additionalSubHeader}
          />
        )}
        {!loading && getNumPhotos() > 0 && (
          <Box
            className="photoListBoxInner"
          >
            <Group
              style={{
                paddingLeft: 10,
              }}
              justify="apart"
            >
              <SelectionBar
                selectMode={selectionState.selectMode}
                selectedItems={selectionState.selectedItems}
                idx2hash={idx2hash}
                updateSelectionState={updateSelectionState}
              />
              <Group justify="right">
                {/* @ts-ignore */ }
                {!route.location.pathname.startsWith("/deleted") && (
                  <SelectionActions
                    selectedItems={selectionState.selectedItems}
                    // @ts-ignore
                    albumID={params ? params.albumID : undefined}
                    title={title}
                    setAlbumCover={actionType => {
                      if (actionType === "person") {
                        setPersonAlbumCover({
                          id: `${params.albumID}`,
                          cover_photo: selectionState.selectedItems[0].id,
                        });
                      }
                      if (actionType === "useralbum") {
                        setUserAlbumCover({
                          id: `${params.albumID}`,
                          photo: selectionState.selectedItems[0].id,
                        });
                      }
                    }}
                    onAddToAlbum={() => setModalAddToAlbumOpen(true)}
                    updateSelectionState={updateSelectionState}
                  />
                )}
                <TrashcanActions
                  selectedItems={selectionState.selectedItems}
                  updateSelectionState={updateSelectionState}
                />
              </Group>
            </Group>
          </Box>
        )}
      </Box>
      {!loading && photos && photos.length > 0 ? (
        <ScrollScrubber
          scrollPositions={dataForScrollIndicator}
          scrollToY={scrollToY}
          targetHeight={gridHeight.current}
          type={ScrollerType.enum.date}
        >
          <div
            style={{
              padding: 10,
            }}
          >
            <Pig
              ref={pigRef}
              className="scrollscrubbertarget"
              imageData={photos}
              selectable={selectable === undefined || selectable}
              selectedItems={selectionStateRef.current.selectedItems}
              handleSelection={handleSelection}
              handleClick={handleClick}
              scaleOfImages={1}
              groupByDate={isDateView}
              getUrl={getUrl}
              toprightoverlay={FavoritedOverlay}
              bottomleftoverlay={VideoOverlay}
              numberOfItems={numberOfItems ?? idx2hashRef.current.length}
              updateItems={updateItems ? throttledUpdateItems : () => {}}
              updateGroups={updateGroups ? throttledUpdateGroups : () => {}}
              bgColor="inherit"
            />
          </div>
        </ScrollScrubber>
      ) : (
        <div />
      )}

      <div
        style={{
          position: "fixed",
          right: 0,
          top: TOP_MENU_HEIGHT,
          height: height - TOP_MENU_HEIGHT,
          width: TIMELINE_SCROLL_WIDTH,
        }}
      />

      {lightboxShow && (
        <LightBox
          idx2hash={idx2hash}
          lightboxImageIndex={lightboxImageIndex}
          lightboxImageId={lightboxImageId}
          onCloseRequest={() => {
            setLightboxShow(false);
            setScrollLocked(false);
          }}
          onImageLoad={() => {
            getPhotoDetails(idx2hash[lightboxImageIndex].id);
          }}
          onMovePrevRequest={() => {
            const prevIndex = (lightboxImageIndex + idx2hash.length - 1) % idx2hash.length;
            setLightboxImageIndex(prevIndex);
            setLightboxImageId(idx2hash[prevIndex].id);
            getPhotoDetails(idx2hash[prevIndex].id);
          }}
          onMoveNextRequest={() => {
            const nextIndex = (lightboxImageIndex + idx2hash.length + 1) % idx2hash.length;
            setLightboxImageIndex(nextIndex);
            setLightboxImageId(idx2hash[nextIndex].id);
            getPhotoDetails(idx2hash[nextIndex].id);
          }}
        />
      )}

        <ModalAlbumEdit
          isOpen={modalAddToAlbumOpen}
          onRequestClose={() => {
            setModalAddToAlbumOpen(false);
            updateSelectionState({ selectedItems: [], selectMode: false });
          }}
          selectedImages={selectionState.selectedItems}
        />
    </div>
  );
}

export const PhotoListView = React.memo(
  PhotoListViewComponent,
  (prev, next) => prev.loading === next.loading && prev.idx2hash === next.idx2hash
);
