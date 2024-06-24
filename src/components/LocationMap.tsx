import { Box, Image, Loader } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { getAveragedCoordinates } from "@/utils/utils";

type Props = Readonly<{
  photos: any[];
}>;

export function LocationMap({ photos }: Props) {
  // const mapRef = useRef<Map>(null);
  const height = "200px";

//   useEffect(() => {
//     mapRef.current?.leafletElement.invalidateSize();
//   }, [height, photos]);

  const photosWithGPS = photos.filter(photo => photo.exif_gps_lon !== null && photo.exif_gps_lon);
  const { avgLat, avgLon } = getAveragedCoordinates(photosWithGPS);

  const markers = photosWithGPS.map(photo => (
    <Marker key={photo.image_hash} position={[photo.exif_gps_lat, photo.exif_gps_lon]}>
      <Popup>
        <div>
          <Image src={photo.thumbnail} />
        </div>
      </Popup>
    </Marker>
  ));

  if (photosWithGPS.length > 0) {
    const zoom = 16;
    return (
      <Box style={{ zIndex: 2, height, padding: 0 }}>
        <MapContainer style={{ height }} center={[avgLat, avgLon]} zoom={zoom}>
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {markers}
        </MapContainer>
      </Box>
    );
  }
  return (
    <Box style={{ height }}>
      <Loader>Map loading...</Loader>
    </Box>
  );
}
