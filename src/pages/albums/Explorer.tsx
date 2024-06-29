import { Box, Button, Group, Stack, Title } from "@mantine/core";
import { IconBalloon as Ballon } from "@tabler/icons-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useFetchPeopleAlbumsQuery } from "@/api/endpoints/albums/people";
import { useFetchPlacesAlbumsQuery } from "@/api/endpoints/albums/places";
import { useFetchThingsAlbumsQuery } from "@/api/endpoints/albums/things";
import { Tile } from "@/components/Tile";
import { HeaderComponent } from "./HeaderComponent";

function showMoreButton(navigate: Function, link: string) {
  return (
    <Button variant="light" color="gray" onClick={() => navigate(link)}>
      Show More
    </Button>
  );
}

function albumTileLink(id: number, image_hash: string, isVideo: boolean, link: string) {
  return (
    <Link key={id} to={link}>
      <Tile video={isVideo} height={190} width={190} image_hash={image_hash} />
    </Link>
  );
}

export default function Explorer() {
  const navigate = useNavigate();
  const { data: peopleAlbums, isFetching: isFetchingPeopleAlbums } = useFetchPeopleAlbumsQuery();
  const { data: thingsAlbums, isFetching: isFetchingThingsAlbums } = useFetchThingsAlbumsQuery();
  const { data: placesAlbums, isFetching: isFetchingPlacesAlbums } = useFetchPlacesAlbumsQuery();

  return (
    <Stack>
      <HeaderComponent
        icon={<Ballon size={50} />}
        fetching={isFetchingPeopleAlbums || isFetchingThingsAlbums || isFetchingPlacesAlbums}
        title="Explorer"
        subtitle="Explore your photos."
      />

      {!isFetchingPeopleAlbums && (
        <>
          <Title order={3}>People</Title>
          <Group>
            {peopleAlbums
              ?.slice(0, 19)
              .map(album => albumTileLink(+album.key, album.face_photo_url, !!album.video, `/person/${album.key}/`))}
            <Box color="gray">{showMoreButton(navigate, "/people/")}</Box>
          </Group>
        </>
      )}

      {!isFetchingThingsAlbums && (
        <>
          <Title order={3}>Things</Title>
          <Group>
            {thingsAlbums
              ?.slice(0, 19)
              .map(album =>
                albumTileLink(
                  album.id,
                  album.cover_photos[0].image_hash,
                  !!album.cover_photos[0].video,
                  `/thing/${album.id}/`
                )
              )}
            <Box color="gray">{showMoreButton(navigate, "/things/")}</Box>
          </Group>
        </>
      )}

      {!isFetchingPlacesAlbums && (
        <>
          <Title order={3}>Places</Title>
          <Group>
            {placesAlbums
              ?.slice(0, 19)
              .map(album =>
                albumTileLink(
                  album.id,
                  album.cover_photos[0].image_hash,
                  !!album.cover_photos[0].video,
                  `/place/${album.id}/`
                )
              )}
            <Box color="gray">{showMoreButton(navigate, "/places/")}</Box>
          </Group>
        </>
      )}
    </Stack>
  );
}
