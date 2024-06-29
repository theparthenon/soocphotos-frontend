import { IconTags as Tags } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useLazyFetchThingsAlbumQuery } from "@/api/endpoints/albums/things";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";

export default function AlbumThingGallery() {
  const { albumID } = useParams();
  const [fetchAlbum, { data: groupedPhotos, isLoading: fetchingAlbumsThing }] = useLazyFetchThingsAlbumQuery();

  useEffect(() => {
    if (albumID) {
      fetchAlbum(albumID);
    }
  }, [albumID, fetchAlbum]);

  return (
    <PhotoListView
      title={groupedPhotos ? groupedPhotos.title : "Loading..."}
      loading={fetchingAlbumsThing}
      icon={<Tags size={50} />}
      photoset={groupedPhotos ? groupedPhotos.grouped_photos : []}
      idx2hash={groupedPhotos ? groupedPhotos.grouped_photos.flatMap(el => el.items) : []}
      selectable
    />
  );
}
