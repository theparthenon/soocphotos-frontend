import { IconTrash as Trash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

import { PigPhoto } from "react-pig";
import { useFetchDateAlbumQuery, useFetchDateAlbumsQuery } from "@/api/endpoints/albums/date";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";
import { PhotosetType } from "@/reducers/photosReducer";
import { getPhotosFlatFromGroupedByDate } from "@/utils/utils";
import type { PhotoGroup } from "./Common";

export default function DeletedPhotos() {
  const [photosFlat, setPhotosFlat] = useState<PigPhoto[]>([]);

  const { data: photosGroupedByDate, isLoading } = useFetchDateAlbumsQuery({ photosetType: PhotosetType.DELETED });

  useEffect(() => {
    if (photosGroupedByDate) setPhotosFlat(getPhotosFlatFromGroupedByDate(photosGroupedByDate));
  }, [photosGroupedByDate]);

  const [group, setGroup] = useState({} as PhotoGroup);
  useFetchDateAlbumQuery(
    { album_date_id: group.id, page: group.page, photosetType: PhotosetType.DELETED },
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
      title="Deleted Photos"
      loading={isLoading}
      icon={<Trash size={50} />}
      photoset={photosGroupedByDate ?? []}
      updateGroups={getAlbums}
      idx2hash={photosFlat}
      selectable
    />
  );
}
