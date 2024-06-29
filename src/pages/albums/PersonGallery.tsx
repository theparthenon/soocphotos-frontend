import { IconUser as User } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PigPhoto } from "@/@types/photos";
import { useFetchDateAlbumQuery, useFetchDateAlbumsQuery } from "@/api/endpoints/albums/date";
import { useFetchPeopleAlbumsQuery } from "@/api/endpoints/albums/people";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";
import { PhotosetType } from "@/reducers/photosReducer";
import { getPhotosFlatFromGroupedByDate } from "@/utils/utils";
import type { PhotoGroup } from "@/pages/photos/Common";

export default function PersonGallery(): JSX.Element {
  const { albumID } = useParams();
  const [photosFlat, setPhotosFlat] = useState<PigPhoto[]>([]);
  const { data: people } = useFetchPeopleAlbumsQuery();

  const person = people?.filter((i: any) => i.key === albumID)[0];
  const personname = person ? person.value : undefined;

  const { data: photosGroupedByDate, isLoading } = useFetchDateAlbumsQuery({
    photosetType: PhotosetType.PERSON,
    person_id: albumID ? +albumID : undefined,
  });

  useEffect(() => {
    if (photosGroupedByDate) setPhotosFlat(getPhotosFlatFromGroupedByDate(photosGroupedByDate));
  }, [photosGroupedByDate]);

  const [group, setGroup] = useState({} as PhotoGroup);
  useFetchDateAlbumQuery(
    {
      album_date_id: group.id,
      page: group.page,
      photosetType: PhotosetType.PERSON,
      person_id: albumID ? +albumID : undefined,
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
      title={personname || "Loading"}
      loading={isLoading}
      icon={<User size={50} />}
      photoset={photosGroupedByDate ?? []}
      idx2hash={photosFlat}
      updateGroups={getAlbums}
      selectable
    />
  );
}
