import { Button, Group, Stack, Title } from "@mantine/core";
import { IconAlbum as Album } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import { push } from "redux-first-history";

import { useFetchAutoAlbumsQuery } from "@/api/endpoints/albums/auto";
import { useFetchUserAlbumsQuery } from "@/api/endpoints/albums/user";
import { Tile } from "@/components/Tile";
import { useAppDispatch } from "@/store/store";
import { HeaderComponent } from "./HeaderComponent";

export default function AlbumViewer() {
  const dispatch = useAppDispatch();
  const entrySquareSize = 200;
  const { data: autoAlbums, isFetching: isFetchingAutoAlbums } = useFetchAutoAlbumsQuery();
  const { data: userAlbums, isFetching: isFetchingUserAlbums } = useFetchUserAlbumsQuery();

  return (
    <Stack>
      <HeaderComponent
        icon={<Album size={50} />}
        fetching={isFetchingAutoAlbums || isFetchingUserAlbums}
        title="Albums"
        subtitle="Explore your photos."
      />

      <Group justify="apart">
        <Title order={3}>My Albums</Title>
        <Button variant="subtle" component={Link} to="/albums/user/">
          View all
        </Button>
      </Group>
      <Group>
        {userAlbums?.slice(0, 19).map(album => (
          <Tile
            key={album.id}
            onClick={() => {
              dispatch(push(`/album/${album.id}`));
            }}
            video={album.cover_photo.video === true}
            height={entrySquareSize - 10}
            width={entrySquareSize - 10}
            image_hash={album.cover_photo.image_hash}
          />
        ))}
      </Group>

      <Group justify="apart">
        <Title order={3}>Events</Title>
        <Button variant="subtle" component={Link} to="/events/">
          View all
        </Button>
      </Group>
      <Group>
        {autoAlbums?.slice(0, 19).map(album => (
          <Tile
            key={album.id}
            onClick={() => {
              dispatch(push(`/album/${album.id}`));
            }}
            video={album.photos.video === true}
            height={entrySquareSize - 10}
            width={entrySquareSize - 10}
            image_hash={album.photos.image_hash}
          />
        ))}
      </Group>
    </Stack>
  );
}
