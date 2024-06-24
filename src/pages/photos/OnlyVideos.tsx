import { IconVideo as Video } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

import { PigPhoto, PhotoGroup } from "@/@types/photos";
import { useFetchDateAlbumQuery, useFetchDateAlbumsQuery } from "@/api/endpoints/albums/date";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";
import { PhotosetType } from "@/reducers/photosReducer";
import { getPhotosFlatFromGroupedByDate } from "@/utils/utils";

export default function OnlyVideos() {
    const [photosFlat, setPhotosFlat] = useState<PigPhoto[]>([]);
    const {
        data: photosGroupedByDate,
        isLoading
    } = useFetchDateAlbumsQuery({ photosetType: PhotosetType.VIDEOS });

    useEffect(() => {
        if (photosGroupedByDate) setPhotosFlat(getPhotosFlatFromGroupedByDate(photosGroupedByDate));
    }, [photosGroupedByDate]);

    const [group, setGroup] = useState({} as PhotoGroup);

    useFetchDateAlbumQuery(
        {
            album_date_id: group.id,
            page: group.page,
            photosetType: PhotosetType.VIDEOS
        },
        { skip: !group.id }
    );

    const getAlbums = (visibleGroups: any) => {
        visibleGroups.reverse().forEach((photoGroup: any) => {
            const visibleImages = photoGroup.items;

            if (visibleImages.filter((i: any) => i.isTemp).length > 0) {
                const firstTempObject = visibleImages.filter((i: any) => i.isTemp)[0];
                const page = Math.ceil((parseInt(firstTempObject.id, 10) + 1) / 100);

                setGroup({ id: photoGroup.id, page });
            }
        });
    };

    return (
        <PhotoListView
            title="Videos"
            loading={isLoading}
            icon={<Video size={50} />}
            photoset={photosGroupedByDate ?? []}
            updateGroups={getAlbums}
            idx2hash={photosFlat}
            selectable
        />
    );
}