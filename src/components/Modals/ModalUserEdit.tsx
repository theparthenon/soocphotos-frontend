import { Box, Button, Grid, Modal, ScrollArea, SimpleGrid, Space, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail as Mail, IconUser as User } from "@tabler/icons-react";
import type { FormEvent } from "react";
import React, { useEffect, useRef, useState } from "react";
import SortableTree from "react-sortable-tree";
import FileExplorerTheme from "react-sortable-tree-theme-file-explorer";

import { scanPhotos } from "@/actions/photosActions";
import { useManageUpdateUserMutation } from "@/api/api";
import type { DirTree } from "@/@types/dir-tree";
import { useLazyFetchDirsQuery } from "@/api/endpoints/dirTree";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { IUser } from "@/@types/user";
import { EMAIL_REGEX, mergeDirTree } from "@/utils/utils";
import { PasswordEntry } from "@/components/Settings/PasswordEntry";

type Props = Readonly<{
    isOpen: boolean;
    updateAndScan?: boolean;
    userToEdit: any;
    selectedNodeId?: string;
    onRequestClose: () => void;
    userList: any;
    createNew: boolean;
    firstTimeSetup?: boolean;
  }>;

  const findPath = (tree: DirTree[], path: string): boolean => {
    let result = false;
    tree.forEach(folder => {
      if (path === folder.absolute_path) {
        result = result || true;
      }
      if (path.startsWith(folder.absolute_path)) {
        const resultChildren = findPath(folder.children, path);
        result = result || resultChildren;
      }
      return result || false;
    });
    return result;
  };

  export function ModalUserEdit(props: Props) {
    const {
      isOpen,
      updateAndScan,
      selectedNodeId,
      onRequestClose: closeModal,
      userList,
      createNew,
      firstTimeSetup,
      userToEdit,
    } = props;
    const [treeData, setTreeData] = useState<DirTree[]>([]);
    const [userPassword, setUserPassword] = useState("");
    const [newPasswordIsValid, setNewPasswordIsValid] = useState(true);

    const [scanDirectoryPlaceholder, setScanDirectoryPlaceholder] = useState("");
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const inputRef = useRef<HTMLInputElement>(null);
    const [closing, setClosing] = useState(false);
    const [updateUser] = useManageUpdateUserMutation();
    const [fetchDirectoryTree, { data: directoryTree }] = useLazyFetchDirsQuery();

    const validateUsername = (username: string) => {
      if (!username) {
        return "Username can not be blank";
      }
      const exist = userList.reduce(
        (acc: boolean, user: IUser) =>
          acc || (user.id !== userToEdit.id && user.username.toLowerCase() === username.toLowerCase()),
        false
      );
      if (exist) {
        return "A user with that username already exists";
      }
      return null;
    };

    const validateEmail = (email: string) => {
      if (email && !EMAIL_REGEX.test(email)) {
        return "Enter a valid email address";
      }
      return null;
    };

    const validatePath = (path: string) => {
      if (firstTimeSetup && !path) {
        return "You must specify a scan directory";
      }
      if (path) {
        if (!findPath(treeData, path)) {
          return "Path does not exist";
        }
      }
      return null;
    };

    const form = useForm({
      initialValues: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
      },
      validate: {
        email: value => validateEmail(value),
        username: value => validateUsername(value),
      },
    });

    useEffect(() => {
      if (auth?.access?.is_admin) {
        fetchDirectoryTree("");
      }
    }, [auth.access, dispatch]);

    useEffect(() => {
      if (!directoryTree) {
        return;
      }
      if (treeData.length === 0) {
        setTreeData(directoryTree);
      } else {
        const tree = mergeDirTree(treeData, directoryTree[0]);
        setTreeData([...tree]);
      }
    }, [directoryTree]);

    useEffect(() => {
      if (userToEdit) {
        form.setValues({
          username: userToEdit.username,
          email: userToEdit.email,
          first_name: userToEdit.first_name,
          last_name: userToEdit.last_name,
          password: userPassword || "",
        });
      } else {
        setScanDirectoryPlaceholder("not set");
      }
    }, [userToEdit]);

    const nodeClicked = (event: Event, rowInfo: any) => {
      if (inputRef.current) {
        const path = rowInfo.node.absolute_path;
        inputRef.current.value = path;
        fetchDirectoryTree(path);
      }
    };

    const validateAndClose = () => {
      setClosing(true);

      if (!newPasswordIsValid) {
        return;
      }
      const { email, username, first_name: firstName, last_name: lastName } = form.values;
      const newUserData = { ...userToEdit };

      newUserData.email = email;
      newUserData.first_name = firstName;
      newUserData.last_name = lastName;

      if (userPassword) {
        newUserData.password = userPassword;
      }
      if (username) {
        newUserData.username = username;
      }

      closeModal();
    };

    const onPasswordValidate = (pass: string, valid: boolean) => {
      setUserPassword(pass);
      setNewPasswordIsValid(valid);
    };

    function onSubmit(event: FormEvent<HTMLFormElement>): void {
      event.preventDefault();
      const result = form.validate();
      if (!result.hasErrors) {
        validateAndClose();
      }
    }

    return (
      <Modal
        opened={isOpen}
        centered
        scrollAreaComponent={ScrollArea.Autosize}
        size="xl"
        onClose={() => {
          closeModal();
        }}
        title={<Title order={4}>Edit User</Title>}
      >
        <form onSubmit={onSubmit}>
          <Box>
            <SimpleGrid cols={2} spacing="xs">
              <TextInput
                required
                label="Username"
                leftSection={<User />}
                placeholder="Username"
                name="username"
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...form.getInputProps("username")}
              />
              <TextInput
                label="Email"
                leftSection={<Mail />}
                placeholder="Email"
                name="email"
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...form.getInputProps("email")}
              />
              <TextInput
                label="First Name"
                leftSection={<User />}
                placeholder="First Name"
                name="first_name"
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...form.getInputProps("first_name")}
              />
              <TextInput
                label="Last Name"
                leftSection={<User />}
                placeholder="Last Name"
                name="last_name"
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...form.getInputProps("last_name")}
              />
            </SimpleGrid>
            <PasswordEntry createNew={createNew} onValidate={onPasswordValidate} closing={closing} />
          </Box>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="default" onClick={() => closeModal()}>
              Cancel
            </Button>
            <Space w="md" />
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    );
  }

  ModalUserEdit.defaultProps = {
    updateAndScan: false,
    selectedNodeId: "",
    firstTimeSetup: false,
  };
