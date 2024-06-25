import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { PartialPhotoWithLocation, getAveragedCoordinates } from "@/utils/utils";

type Props = {
  photos: PartialPhotoWithLocation[];
};

export function AlbumLocationMap({ photos }: Readonly<Props>) {
  const photosWithGPS = photos.filter(photo => photo.exif_gps_lon !== null && photo.exif_gps_lat !== null);
  const { avgLat, avgLon } = getAveragedCoordinates(photosWithGPS);

  const markers = photosWithGPS.map(photo => (
    // @ts-ignore
    <Marker key={`marker-${photo.id}`} position={[photo.exif_gps_lat, photo.exif_gps_lon]} />
  ));
  if (photosWithGPS.length > 0) {
    return (
      <div style={{ padding: 0 }}>
        <MapContainer center={[avgLat, avgLon]} zoom={6}>
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {markers}
        </MapContainer>
      </div>
    );
  }
  return <div />;
}