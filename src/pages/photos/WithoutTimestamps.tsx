import { IconPhoto as Photo } from "@tabler/icons-react";
import React, { useEffect } from "react";

import { useLazyFetchPhotosWithoutTimestampQuery } from "@/api/endpoints/photos/list";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";
import type { PhotosState } from "@/reducers/photosReducer";
import { PhotosetType } from "@/reducers/photosReducer";
import { useAppSelector } from "@/store/store";

export default function WithoutTimestampPhotosView() {
    const {
        fetchedPhotosetType,
        numberOfPhotos,
        photosFlat
    } = useAppSelector(state => state.photos as PhotosState);
    const [fetchPhotos] = useLazyFetchPhotosWithoutTimestampQuery();

    useEffect(() => {
        if (fetchedPhotosetType !== PhotosetType.NO_TIMESTAMP) {
            fetchPhotos(1);
        }
    }, []);

    const getImages = (visibleItems: any) => {
        if (visibleItems.filter((i: any) => i.isTemp).length > 0) {
            const firstTempObject = visibleItems.filter((i: any) => i.isTemp)[0];
            const page = Math.ceil((parseInt(firstTempObject.id, 10) + 1) / 100);

            if (page > 1) {
                fetchPhotos(page);
            }
        }
    };

    return (
        <PhotoListView
            title="Photos Without Timestamps"
            loading={fetchedPhotosetType !== PhotosetType.NO_TIMESTAMP}
            icon={<Photo size={50} />}
            photoset={photosFlat}
            idx2hash={photosFlat}
            updateItems={getImages}
            selectable
        />
    );
}