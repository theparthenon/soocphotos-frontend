import { ActionIcon, Button, Group, Image, Menu, Modal, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical as DotsVertical,
  IconEdit as Edit,
  IconTrash as Trash,
  IconUsers as Users,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AutoSizer, Grid } from "react-virtualized";

import {
  useDeletePersonAlbumMutation,
  useFetchPeopleAlbumsQuery,
  useRenamePersonAlbumMutation,
} from "@/api/endpoints/albums/people";
import { Tile } from "@/components/Tile";
import { useAlbumListGridConfig } from "@/hooks/useAlbumListGridConfig";
import { HeaderComponent } from "./HeaderComponent";

export default function People() {
  const [deleteDialogVisible, { open: showDeleteDialog, close: hideDeleteDialog }] = useDisclosure(false);
  const [renameDialogVisible, { open: showRenameDialog, close: hideRenameDialog }] = useDisclosure(false);
  const [personID, setPersonID] = useState("");
  const [personName, setPersonName] = useState("");
  const [newPersonName, setNewPersonName] = useState("");
  const { data: albums, isFetching } = useFetchPeopleAlbumsQuery();
  const { entriesPerRow, entrySquareSize, numberOfRows, gridHeight } = useAlbumListGridConfig(albums || []);
  const [renamePerson] = useRenamePersonAlbumMutation();
  const [deletePerson] = useDeletePersonAlbumMutation();

  function openDeleteDialog(id: string) {
    setPersonID(id);
    showDeleteDialog();
  }

  function openRenameDialog(id: string, name: string) {
    setPersonID(id);
    setPersonName(name);
    setNewPersonName("");
    showRenameDialog();
  }

  function getPersonIcon(album) {
    if (album.face_count === 0) {
      return <Image height={entrySquareSize - 10} width={entrySquareSize - 10} src="/unknown_user.jpg" />;
    }

    if (album.text === "unknown") {
      return (
        <Link to={`/person/${album.key}`}>
          <Image height={entrySquareSize - 10} width={entrySquareSize - 10} src="/unknown_user.jpg" />
        </Link>
      );
    }

    return (
      <Link to={`/person/${album.key}`}>
        <Tile
          video={album.video}
          height={entrySquareSize - 10}
          width={entrySquareSize - 10}
          image_hash={album.face_photo_url}
        />
      </Link>
    );
  }

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
        <div style={{ padding: 5 }}>
          {getPersonIcon(album)}
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <Menu position="bottom-end">
              <Menu.Target>
                <ActionIcon>
                  <DotsVertical />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<Edit />} onClick={() => openRenameDialog(album.key, album.text)}>
                  Rename
                </Menu.Item>
                <Menu.Item leftSection={<Trash />} onClick={() => openDeleteDialog(album.key)}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
        <div style={{ paddingLeft: 15, paddingRight: 15, height: 50 }}>
          <Group justify="apart">
            <div>
              <b>{album.text}</b> <br />
              {album.face_count} Photos
            </div>
          </Group>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeaderComponent
        icon={<Users size={50} />}
        title="People"
        fetching={isFetching}
        subtitle={((albums && albums.length) || 0) + " People"}
      />
      <Modal title="Rename Person" onClose={hideRenameDialog} opened={renameDialogVisible}>
        <Group>
          <TextInput
            error={
              albums && albums.map(el => el.text.toLowerCase().trim()).includes(newPersonName.toLowerCase().trim())
                ? "Person " + newPersonName.trim() + " already exists."
                : false
            }
            onChange={e => {
              setNewPersonName(e.currentTarget.value);
            }}
            placeholder="Name"
          />
          <Button
            onClick={() => {
              renamePerson({ id: personID, personName, newPersonName });
              hideRenameDialog();
            }}
            disabled={
              albums && albums.map(el => el.text.toLowerCase().trim()).includes(newPersonName.toLowerCase().trim())
            }
            type="submit"
          >
            Rename
          </Button>
        </Group>
      </Modal>
      <Modal opened={deleteDialogVisible} title="Delete Person" onClose={hideDeleteDialog}>
        <Text size="sm">Do you really want to delete this person?</Text>
        <Group>
          <Button onClick={hideDeleteDialog}>Cancel</Button>
          <Button
            color="red"
            onClick={() => {
              deletePerson(personID);
              hideDeleteDialog();
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>

      <AutoSizer disableHeight style={{ outline: "none", padding: 0, margin: 0 }}>
        {({ width }) => (
          <Grid
            style={{ outline: "none" }}
            headerHeight={100}
            disableHeader={false}
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
