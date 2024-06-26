import { IconPhoto as Photo } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

import { PigPhoto } from "@/@types/photos";
import { useFetchDateAlbumQuery, useFetchDateAlbumsQuery } from "@/api/endpoints/albums/date";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";
import { PhotosetType } from "@/reducers/photosReducer";
import { getPhotosFlatFromGroupedByDate } from "@/utils/utils";

type PhotoGroup = {
  id: string;
  page: number;
  items?: PigPhoto[];
};

export default function OnlyPhotos() {
    const [photosFlat, setPhotosFlat] = useState<PigPhoto[]>([]);
    const { data: photosGroupedByDate, isLoading } = useFetchDateAlbumsQuery({ photosetType: PhotosetType.PHOTOS });

    useEffect(() => {
        if (photosGroupedByDate) setPhotosFlat(getPhotosFlatFromGroupedByDate(photosGroupedByDate));
      }, [photosGroupedByDate]);

      const [group, setGroup] = useState({} as PhotoGroup);
      useFetchDateAlbumQuery(
        { album_date_id: group.id, page: group.page, photosetType: PhotosetType.PHOTOS },
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
            title="Photos"
            loading={isLoading}
            icon={<Photo size={50} />}
            photoset={photosGroupedByDate ?? []}
            updateGroups={getAlbums}
            idx2hash={photosFlat}
            selectable
        />
    );
}