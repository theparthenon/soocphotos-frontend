import { ActionIcon, Button, Chip, Divider, Group, Menu, Modal, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical as DotsVertical,
  IconEdit as Edit,
  IconTrash as Trash,
  IconUserCheck as UserCheck,
} from "@tabler/icons-react";
import _ from "lodash";
import React, { useEffect, useState } from "react";

import {
  useDeletePersonAlbumMutation,
  useFetchPeopleAlbumsQuery,
  useRenamePersonAlbumMutation,
} from "@/api/endpoints/albums/people";
import { api } from "@/api/api";
import { notification } from "@/services/notifications";
import { useAppDispatch, useAppSelector } from "@/store/store";

type Props = {
  cell: any;
  width: number;
  style: any;
  entrySquareSize: number;
  setSelectedFaces: any;
  selectedFaces: any;
};

export function HeaderComponent({
  cell,
  width,
  style,
  entrySquareSize,
  setSelectedFaces,
  selectedFaces,
}: Readonly<Props>) {
  const { activeTab } = useAppSelector(store => store.face);
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);
  const [renameDialogVisible, { open: showRenameDialog, close: hideRenameDialog }] = useDisclosure(false);
  const [deleteDialogVisible, { open: showDeleteDialog, close: hideDeleteDialog }] = useDisclosure(false);
  const [renamePerson] = useRenamePersonAlbumMutation();
  const [deletePerson] = useDeletePersonAlbumMutation();
  const { data: albums } = useFetchPeopleAlbumsQuery();
  const [personID, setPersonID] = useState("");
  const [personName, setPersonName] = useState("");
  const [newPersonName, setNewPersonName] = useState("");

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

  const handleClick = () => {
    if (!checked) {
      const facesToAdd = cell.faces.map(i => ({ face_id: i.id, face_url: i.face_url }));
      const merged = _.uniqBy([...selectedFaces, ...facesToAdd], el => el.face_id);
      setSelectedFaces(merged);
    } else {
      const remainingFaces = selectedFaces.filter(i => cell.faces.filter(j => j.id === i.face_id).length === 0);
      setSelectedFaces(remainingFaces);
    }
    setChecked(!checked);
  };

  const confirmFacesAssociation = () => {
    const facesToAddIDs = cell.faces.map(i => i.id);
    dispatch(api.endpoints.setFacesPersonLabel.initiate({ faceIds: facesToAddIDs, personName: cell.name }));
    notification.addFacesToPerson(cell.name, facesToAddIDs.length);
  };

  useEffect(() => {
    // deselect when no faces of the current group are selected
    const selectedFacesOfGroup = selectedFaces.filter(i => cell.faces.filter(j => j.id === i.face_id).length > 0);
    if (selectedFacesOfGroup.length === 0) {
      setChecked(false);
    }
  }, [cell.faces, selectedFaces]);

  return (
    <Stack
      gap="xs"
      style={{
        ...style,
        width,
        paddingTop: entrySquareSize / 2.0 - 35,
        height: entrySquareSize,
      }}
    >
      <Group>
        <Chip variant="filled" radius="xs" size="lg" checked={checked} onChange={handleClick}>
          {cell.name}
        </Chip>
        {activeTab === "inferred" && !(cell.kind === "CLUSTER" || cell.kind === "UNKNOWN") && (
          <Tooltip label="Confirm that all faces from this group match with this person and add them to the corresponding face ID">
            <ActionIcon variant="light" color="green" disabled={false} onClick={() => confirmFacesAssociation()}>
              <UserCheck />
            </ActionIcon>
          </Tooltip>
        )}
        {!(cell.kind === "CLUSTER" || cell.kind === "UNKNOWN") && (
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <DotsVertical />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<Edit />} onClick={() => openRenameDialog(cell.id, cell.name)}>
                Rename
              </Menu.Item>
              <Menu.Item leftSection={<Trash />} onClick={() => openDeleteDialog(cell.id)}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
        <Text color="dimmed">
          {cell.faces.length} Faces
        </Text>
      </Group>

      <Divider />
      <Modal title="Rename Person" onClose={hideRenameDialog} opened={renameDialogVisible}>
        <Group>
          <TextInput
            error={
              albums?.map(el => el.text.toLowerCase().trim()).includes(newPersonName.toLowerCase().trim())
                ? "Person " + newPersonName.trim() + " already exists"
                : false
            }
            onChange={e => {
              setNewPersonName(e.currentTarget.value);
            }}
            placeholder="Person"
          />
          <Button
            onClick={() => {
              renamePerson({ id: personID, personName, newPersonName });
              hideRenameDialog();
            }}
            disabled={albums?.map(el => el.text.toLowerCase().trim()).includes(newPersonName.toLowerCase().trim())}
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
    </Stack>
  );
}
