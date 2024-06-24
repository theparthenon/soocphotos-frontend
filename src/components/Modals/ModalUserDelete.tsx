import { Button, Modal, Space, Text, Title } from "@mantine/core";
import { IconTrash as Trash } from "@tabler/icons-react";
import React from "react";

import { useDeleteUserMutation } from "@/api/api";

type Props = Readonly<{
  isOpen: boolean;
  userToDelete: any;
  onRequestClose: () => void;
}>;

export function ModalUserDelete(props: Props) {
  const { isOpen, onRequestClose, userToDelete } = props;
  const [deleteUser] = useDeleteUserMutation();


  const clearStateAndClose = () => {
    onRequestClose();
  };

  const deleteUserAndClose = () => {
    deleteUser({ id: userToDelete.id });
    clearStateAndClose();
  };

  return (
    <Modal
      opened={isOpen}
      centered
      size="md"
      onClose={() => {
        clearStateAndClose();
      }}
      title={
        <Title order={5}>
          <span style={{ paddingRight: "5px" }}>
            <Trash size={16} />
          </span>
          Delete User
        </Title>
      }
    >
      <Text size="sm">
          You are about to delete the following user: {userToDelete.username}. This will delete all
          associated data.
      </Text>
      <br />
      <Text size="sm" color="red">
        This action cannot be undone.
      </Text>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="default" onClick={() => clearStateAndClose()}>
          Cancel
        </Button>
        <Space w="md" />
        <Button disabled={!true} onClick={() => deleteUserAndClose()}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
