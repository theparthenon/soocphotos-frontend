import { IconMap as Map } from "@tabler/icons-react";
import React from "react";
import { useParams } from "react-router-dom";

import { useFetchPlaceAlbumQuery } from "@/api/endpoints/albums/places";
import { PhotoListView } from "@/components/PhotoList/PhotoListView";

export default function AlbumPlaceGallery() {
  const { albumID } = useParams();
  const { data: album, isFetching } = useFetchPlaceAlbumQuery(albumID ?? "");

  return (
    <PhotoListView
      title={album?.title ?? "Loading..."}
      loading={isFetching}
      icon={<Map size={50} />}
      photoset={album?.grouped_photos ?? []}
      idx2hash={album?.grouped_photos.flatMap(el => el.items) ?? []}
      selectable
    />
  );
}
