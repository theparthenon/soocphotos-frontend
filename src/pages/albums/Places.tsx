import { Anchor, Image, Loader } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconMap2 as Map2 } from "@tabler/icons-react";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { AutoSizer, Grid } from "react-virtualized";

import type { PlaceAlbumList } from "@/@types/albums/place";
import { useFetchLocationClustersQuery, useFetchPlacesAlbumsQuery } from "@/api/endpoints/albums/places";
import { serverAddress } from "@/api/apiClient";
import { useAlbumListGridConfig } from "@/hooks/useAlbumListGridConfig";
import { HeaderComponent } from "./HeaderComponent";

type Props = Readonly<{
  height?: number;
}>;

export default function AlbumPlace({ height = 0 }: Props) {
  const { width } = useViewportSize();
  const mapRef = useRef<Map>(null);
  const [visibleAlbums, setVisibleAlbums] = useState<PlaceAlbumList>([]);
  const { data: albums, isFetching: isFetchingAlbums } = useFetchPlacesAlbumsQuery();
  const { data: locationClusters, isFetching: isFetchingLocationClusters } = useFetchLocationClustersQuery();
  const { entriesPerRow, entrySquareSize, numberOfRows, gridHeight } = useAlbumListGridConfig(albums || []);

  function updateVisibleAlbums(map, locations, allAlbums) {
    map.invalidateSize(true);

    const ne = map.getBounds().getNorthEast();
    const sw = map.getBounds().getSouthWest();
    const markers = locations.filter(loc => {
      const markerLng = loc[0];
      const markerLat = loc[1];
      return markerLat < ne.lat && markerLat > sw.lat && markerLng < ne.lng && markerLng > sw.lng;
    });

    const visiblePlaceNames = markers.map(el => el[2]);
    const visiblePlaceAlbums = allAlbums.filter(el => visiblePlaceNames.includes(el.title));
    setVisibleAlbums(_.sortBy(visiblePlaceAlbums, ["geolocation_level", "photo_count"]));
  }

  const onViewportChanged = useCallback(() => {
    if (!mapRef.current || !locationClusters || !albums) {
      return;
    }
    updateVisibleAlbums(mapRef.current.leafletElement, locationClusters, albums);
  }, [albums, locationClusters]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    mapRef.current.leafletElement.invalidateSize(true);
    if (!albums || !locationClusters) {
      return;
    }
    updateVisibleAlbums(mapRef.current.leafletElement, locationClusters, albums);
  }, [mapRef, width, height, albums, locationClusters]);

  function createMarkers() {
    if (!locationClusters) {
      return <div />;
    }
    return locationClusters.map((loc, idx) => {
      const key = `${loc[0]}-${loc[1]}-${idx}`;
      return loc[0] !== 0 ? <Marker key={key} position={[+loc[1], +loc[0]]} /> : <div />;
    });
  }

  function renderCell({ columnIndex, key, rowIndex, style }) {
    if (!visibleAlbums || visibleAlbums.length === 0) {
      return null;
    }
    const index = rowIndex * entriesPerRow + columnIndex;
    if (index >= visibleAlbums.length) {
      return <div key={key} style={style} />;
    }
    const place = visibleAlbums[index];
    return (
      <div key={key} style={style}>
        <div style={{ padding: 5 }}>
          {place.cover_photos.slice(0, 1).map(photo => (
            <Anchor key={index} href={`/albums/place/${place.id}/`}>
              <Image
                width={entrySquareSize - 10}
                height={entrySquareSize - 10}
                src={`${serverAddress}/media/optimized/${photo.image_hash}`}
              />
            </Anchor>
          ))}
        </div>
        <div style={{ paddingLeft: 15, paddingRight: 15, height: 50 }}>
          <b>{place.title}</b>
          <br />{" "}
          {place.photo_count} Photos
        </div>
      </div>
    );
  }

  if (isFetchingAlbums || isFetchingLocationClusters) {
    return (
      <div style={{ height }}>
        <Loader>Map loading...</Loader>
      </div>
    );
  }

  const markers = createMarkers();

  return (
    <div>
      <HeaderComponent
        icon={<Map2 size={50} />}
        title="Places"
        fetching={isFetchingLocationClusters || isFetchingAlbums}
        subtitle={"Showing " +
          visibleAlbums.length + " places on the map"
        }
      />
      <div style={{ marginLeft: -5 }}>
        <Map
          ref={mapRef}
          className="markercluster-map"
          style={{
            height: 240,
          }}
          onViewportChanged={onViewportChanged}
          center={[40, 0]}
          zoom={2}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup>{markers}</MarkerClusterGroup>
        </Map>
      </div>
      <AutoSizer disableHeight style={{ outline: "none", padding: 0, margin: 0 }}>
        {({ width: gridWidth }) => (
          <Grid
            style={{ outline: "none" }}
            cellRenderer={props => renderCell(props)}
            columnWidth={entrySquareSize}
            columnCount={entriesPerRow}
            height={gridHeight}
            width={gridWidth}
            rowHeight={entrySquareSize + 60}
            rowCount={numberOfRows}
          />
        )}
      </AutoSizer>
    </div>
  );
}