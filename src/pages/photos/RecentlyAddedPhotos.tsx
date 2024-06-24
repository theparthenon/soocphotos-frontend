import { IconClock as Clock } from "@tabler/icons-react";
import React, { useEffect } from "react";

import { useLazyFetchRecentlyAddedPhotosQuery } from "@/api/endpoints/photos/recent";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";
import type { PhotosState } from "@/reducers/photosReducer";
import { PhotosetType } from "@/reducers/photosReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";

export default function RecentlyAddedPhotos() {
    const {
        fetchedPhotosetType,
        photosFlat,
        recentlyAddedPhotosDate
    } = useAppSelector(
        state => state.photos as PhotosState
    );
    const dispatch = useAppDispatch();
    const [fetchRecentlyAddedPhotos] = useLazyFetchRecentlyAddedPhotosQuery();

    useEffect(() => {
        if (fetchedPhotosetType !== PhotosetType.RECENTLY_ADDED) {
            fetchRecentlyAddedPhotos();
        }
    }, [dispatch]); // Only run on first render.

    return (
        <PhotoListView
            title="Recently Added Photos"
            loading={fetchedPhotosetType !== PhotosetType.RECENTLY_ADDED}
            icon={<Clock size={50} />}
            date={recentlyAddedPhotosDate}
            photoset={photosFlat}
            idx2hash={photosFlat}
            dayHeaderPrefix="Added On"
            selectable
        />
    );
}