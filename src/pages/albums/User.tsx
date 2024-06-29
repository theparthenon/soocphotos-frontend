import { ActionIcon, Button, Group, Menu, Modal, Popover, Stack, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlbum as Album,
  IconDotsVertical as DotsVertical,
  IconEdit as Edit,
  IconShare as Share,
  IconTrash as Trash,
  IconUser as User,
  IconUsers as Users,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AutoSizer, Grid } from "react-virtualized";

import { UserAlbumInfo } from "@/@types/albums/user";
import {
  useDeleteUserAlbumMutation,
  useFetchUserAlbumsQuery,
  useRenameUserAlbumMutation,
} from "@/api/endpoints/albums/user";
import { Tile } from "@/components/Tile";
import { useAlbumListGridConfig } from "@/hooks/useAlbumListGridConfig";
import { HeaderComponent } from "./HeaderComponent";


export default function AlbumsUser(){
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [albumID, setAlbumID] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [isDeleteDialogOpen, { open: showDeleteDialog, close: hideDeleteDialog }] = useDisclosure(false);
  const [isRenameDialogOpen, { open: showRenameDialog, close: hideRenameDialog }] = useDisclosure(false);
  const { data: albums, isFetching } = useFetchUserAlbumsQuery();
  const { entriesPerRow, entrySquareSize, numberOfRows, gridHeight } = useAlbumListGridConfig(albums ?? []);
  const [deleteUserAlbum] = useDeleteUserAlbumMutation();
  const [renameUserAlbum] = useRenameUserAlbumMutation();

  const openDeleteDialog = (id: string, title: string) => {
    showDeleteDialog();
    setAlbumID(id);
    setAlbumTitle(title);
  };

  const openRenameDialog = (id: string, title: string) => {
    showRenameDialog();
    setAlbumID(id);
    setAlbumTitle(title);
  };

  function renderCell({ columnIndex, key, rowIndex, style }) {
    if (!albums || albums.length === 0) {
      return null;
    }
    const index = rowIndex * entriesPerRow + columnIndex;
    if (index >= albums.length) {
      return <div key={key} style={style} />;
    }
    const album = albums[index];
    return (
      <div key={key} style={style}>
        <div style={{ padding: 5, height: entrySquareSize, width: entrySquareSize }}>
          <Link to={`/albums/user/${album.id}`}>
            <Tile
              video={albums[index].cover_photo.video === true}
              height={entrySquareSize - 10}
              width={entrySquareSize - 10}
              image_hash={albums[index].cover_photo.image_hash}
            />
          </Link>

          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <Menu position="bottom-end">
              <Menu.Target>
                <ActionIcon>
                  <DotsVertical />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<Edit />} onClick={() => openRenameDialog(`${album.id}`, album.title)}>
                  Rename
                </Menu.Item>
                <Menu.Item leftSection={<Trash />} onClick={() => openDeleteDialog(`${album.id}`, album.title)}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
        <div className="personCardName" style={{ paddingLeft: 15, paddingRight: 15, height: 50 }}>
          <Group>
            <Text lineClamp={1} style={{ fontWeight: "bold" }}>
              {album.title}
            </Text>
          </Group>
          {album.photo_count} Photos
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeaderComponent
        icon={<Album size={50} />}
        title="User Albums"
        fetching={isFetching}
        subtitle={"Showing " + (albums?.length ?? 0) + " user created albums"}
      />
      <Modal size="mini" onClose={hideRenameDialog} opened={isRenameDialogOpen}>
        <div style={{ padding: 20 }}>
          <Title order={4}>Rename Album</Title>

          <Group>
            <TextInput
              error={
                albums?.map(el => el.title.toLowerCase().trim()).includes(newAlbumTitle.toLowerCase().trim()) ? (
                  <>
                    Album {newAlbumTitle.trim()} already exists.
                  </>
                ) : (
                  ""
                )
              }
              onChange={v => {
                setNewAlbumTitle(v.currentTarget.value);
              }}
              placeholder="Album Title"
            />

            <Button
              color="green"
              onClick={() => {
                renameUserAlbum({ id: albumID, title: albumTitle, newTitle: newAlbumTitle });
                hideRenameDialog();
              }}
              disabled={albums?.map(el => el.title.toLowerCase().trim()).includes(newAlbumTitle.toLowerCase().trim())}
              type="submit"
            >
              Rename
            </Button>
          </Group>
        </div>
      </Modal>
      <Modal opened={isDeleteDialogOpen} onClose={hideDeleteDialog}>
        <Stack>
          This action will permanently delete the album. This action cannot be undone.
          <Group justify="center">
            <Button color="blue" onClick={hideDeleteDialog}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                deleteUserAlbum({ id: albumID, albumTitle });
                hideDeleteDialog();
              }}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
      <AutoSizer disableHeight style={{ outline: "none", padding: 0, margin: 0 }}>
        {({ width }) => (
          <Grid
            style={{ outline: "none" }}
            disableTitle={false}
            cellRenderer={props => renderCell(props)}
            columnWidth={entrySquareSize}
            columnCount={entriesPerRow}
            height={gridHeight}
            rowHeight={entrySquareSize + 60}
            rowCount={numberOfRows}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );
  }
