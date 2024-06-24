/* eslint-disable jsx-a11y/control-has-associated-label */
import { ActionIcon, Button, Card, Container, Flex, Group, Loader, Space, Stack, Table, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconAdjustments as Adjustments,
  IconEdit as Edit,
  IconPlus as Plus,
  IconTrash as Trash,
} from "@tabler/icons-react";
import { DateTime } from "luxon";
import React, { useState } from "react";

import { useDeleteAllAutoAlbumsMutation } from "@/api/endpoints/albums/auto";
import { useFetchServerStatsQuery, useFetchUserListQuery } from "@/api/api";
import { JobList } from "@/components/Job/JobList";
import { ModalUserDelete } from "@/components/Modals/ModalUserDelete";
import { ModalUserEdit } from "@/components/Modals/ModalUserEdit";
import { useAppSelector } from "@/store/store";
import { SiteSettings } from "./SiteSettings";
import { LOCALE } from "@/constants/api.constant";

function UserTable() {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});
  const [userToDelete, setUserToDelete] = useState({});
  const [createNewUser, setCreateNewUser] = useState(false);
  const { data: userList, isFetching } = useFetchUserListQuery();
  const matches = useMediaQuery("(min-width: 700px)");

  return (
    <Card shadow="md">
      <Title order={4} mb={16}>
        Users
        {isFetching ? <Loader size="xs" /> : null}
      </Title>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Add/Modify/Delete</th>
            <th>Username</th>
            <th>Scan Directory</th>
            {matches && (
              <>
                <th>Minimum Confidence</th>
                <th>Photo Count</th>
                <th>Joined</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {userList?.map(user => (
            <tr key={user.username}>
              <td>
                <span style={{ display: "flex" }}>
                  <ActionIcon
                    variant="transparent"
                    color="blue"
                    title="Modify"
                    onClick={() => {
                      setUserToEdit(user);
                      setCreateNewUser(false);
                      setUserModalOpen(true);
                    }}
                  >
                    <Edit />
                  </ActionIcon>

                  <ActionIcon
                    style={{ marginLeft: "5px" }}
                    variant="transparent"
                    color="red"
                    disabled={user.is_superuser}
                    title={user.is_superuser ? "Cannot Delete Admin User" : "Delete"}
                    onClick={() => {
                      setUserToDelete(user);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash />
                  </ActionIcon>
                </span>
              </td>
              <td>{user.username}</td>
              {matches && <td>{user.confidence ? user.confidence : "Not set"}</td>}
              {matches && <td>{user.photo_count}</td>}
              {matches && <td>{DateTime.fromISO(user.date_joined).setLocale(LOCALE).toRelative()}</td>}
            </tr>
          ))}
        </tbody>
      </Table>
      <Flex justify="flex-end" mt={10}>
        <Button
          size="sm"
          color="green"
          variant="outline"
          leftSection={<Plus />}
          onClick={() => {
            setCreateNewUser(true);
            setUserToEdit({});
            setUserModalOpen(true);
          }}
        >
          Add New User
        </Button>
      </Flex>

      <ModalUserEdit
        onRequestClose={() => {
          setUserModalOpen(false);
        }}
        userToEdit={userToEdit}
        userList={userList}
        isOpen={userModalOpen}
        createNew={createNewUser}
      />
      <ModalUserDelete
        onRequestClose={() => {
          setDeleteModalOpen(false);
        }}
        isOpen={deleteModalOpen}
        userToDelete={userToDelete}
      />
    </Card>
  );
}

function AdminTools() {
  const { data: serverStats, isLoading } = useFetchServerStatsQuery();
  const [deleteAllAutoAlbums] = useDeleteAllAutoAlbumsMutation();

  const downloadFile = () => {
    // create file in browser
    const fileName = "serverstats";
    const json = JSON.stringify(serverStats, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <Card shadow="md">
      <Stack>
        <Title order={4} mb={16}>
          Admin Tools
        </Title>
        <Flex justify="space-between">
          <>Delete All Auto Created Albums</>
          <Button onClick={() => deleteAllAutoAlbums()} variant="outline">
            Delete
          </Button>
        </Flex>
        <Flex justify="space-between">
          <div>Download Server Stats</div>
          <Button loading={isLoading} onClick={() => downloadFile()}>
            Download
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
}

export default function AdminPage() {
  const auth = useAppSelector(state => state.auth);

  if (!auth.access.is_admin) {
    return <div>Unauthorized</div>;
  }

  return (
    <Container>
      <Stack>
        <Flex align="baseline" justify="space-between">
          <Group gap="xs" style={{ marginBottom: 20, marginTop: 40 }}>
            <Adjustments size={35} />
            <Title order={1}>Admin Area</Title>
          </Group>
        </Flex>

        <SiteSettings />

        <AdminTools />

        <UserTable />

        <JobList />

        <Space h="xl" />
      </Stack>
    </Container>
  );
}
