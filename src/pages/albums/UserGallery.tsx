import { IconBookmark as Bookmark } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { DatePhotosGroup, PigPhoto } from "@/@types/photos";
import { useLazyFetchUserAlbumQuery } from "@/api/endpoints/albums/user";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";
import { useAppSelector } from "../../store/store";
import { getPhotosFlatFromGroupedByDate } from "@/utils/utils";

export default function AlbumUserGallery() {
  const [fetchAlbum, { data: album, isFetching }] = useLazyFetchUserAlbumQuery();
  const [flatPhotos, setFlatPhotos] = useState<PigPhoto[]>([]);
  const [groupedPhotos, setGroupedPhotos] = useState<DatePhotosGroup[]>([]);
  const auth = useAppSelector(store => store.auth);
  const { albumID } = useParams();

  useEffect(() => {
    if (!albumID) {
      return;
    }
    fetchAlbum(albumID);
  }, [albumID, fetchAlbum]);

  useEffect(() => {
    if (!album) {
      return;
    }
    setGroupedPhotos(album.grouped_photos);
    setFlatPhotos(getPhotosFlatFromGroupedByDate(album.grouped_photos));
  }, [album, auth]);

  function getSubheader(showHeader: boolean) {
    if (showHeader && album) {
      return (
        <span>
          {", "}owned by {album.owner.id === auth.access?.user_id ? "you" : album.owner.username}
        </span>
      );
    }
    return <div />;
  }

  return (
    <PhotoListView
      title={album ? album.title : "Loading..."}
      loading={isFetching}
      icon={<Bookmark size={50} />}
      photoset={groupedPhotos}
      idx2hash={flatPhotos}
      selectable
    />
  );
}
