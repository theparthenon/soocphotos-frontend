import { Box, Button, Grid, Modal, ScrollArea, SimpleGrid, Space, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail as Mail, IconUser as User } from "@tabler/icons-react";
import type { FormEvent } from "react";
import React, { useEffect, useRef, useState } from "react";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import FileExplorerTheme from "react-sortable-tree-theme-file-explorer";

import type { DirTree } from "@/@types/dir-tree";
import { IUser } from "@/@types/user";
import { useManageUpdateUserMutation } from "@/api/api";
import { useLazyFetchDirsQuery } from "@/api/endpoints/dirTree";
import { useScanPhotosMutation } from "@/api/endpoints/photos/scan";
import { PasswordEntry } from "@/components/Settings/PasswordEntry";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { EMAIL_REGEX, mergeDirTree } from "@/utils/utils";

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
  const [scanPhotos] = useScanPhotosMutation();

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
      scan_directory: "",
    },
    validate: {
      email: value => validateEmail(value),
      username: value => validateUsername(value),
      scan_directory: value => validatePath(value),
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
      if (userToEdit.scan_directory) {
        setScanDirectoryPlaceholder(userToEdit.scan_directory);
      } else {
        setScanDirectoryPlaceholder("Not Set");
      }
      form.setValues({
        username: userToEdit.username,
        email: userToEdit.email,
        first_name: userToEdit.first_name,
        last_name: userToEdit.last_name,
        scan_directory: userToEdit.scan_directory,
        password: userPassword || "",
      });
    } else {
      setScanDirectoryPlaceholder("Not Set");
    }
  }, [userToEdit]);

  useEffect(() => {
    if (form.values.scan_directory) {
      setScanDirectoryPlaceholder(form.values.scan_directory);
    }
  }, [form.values.scan_directory]);

  const nodeClicked = (event: Event, rowInfo: any) => {
    if (inputRef.current) {
      const path = rowInfo.node.absolute_path;
      inputRef.current.value = path;
      fetchDirectoryTree(path);
      form.setFieldValue("scan_directory", path);
    }
  };

  const validateAndClose = () => {
    setClosing(true);

    if (!newPasswordIsValid) {
      return;
    }
    const { email, username, first_name: firstName, last_name: lastName, scan_directory: scanDirectory } = form.values;
    const newUserData = { ...userToEdit };

    if (scanDirectory) {
      newUserData.scan_directory = scanDirectory;
    }
    if (!newUserData.scan_directory) {
      delete newUserData.scan_directory;
    }

    // if (createNew) {
    //   if (userPassword && username) {
    //     signup({
    //       username: username.toLowerCase(),
    //       password: userPassword,
    //       email,
    //       first_name: firstName,
    //       last_name: lastName,
    //     });
    //     closeModal();
    //   }
    //   return;
    // }
    newUserData.email = email;
    newUserData.first_name = firstName;
    newUserData.last_name = lastName;

    if (userPassword) {
      newUserData.password = userPassword;
    }
    if (username) {
      newUserData.username = username;
    }

    if (updateAndScan) {
      updateUser(newUserData).then(() => {
        if (newUserData.scan_directory) {
          scanPhotos();
        }
      });
    } else {
      updateUser(newUserData);
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
        {!createNew && (
          <>
            <Title order={5}>Set the scan directory for user</Title>
            <Text size="sm" color="dimmed">
              When the user &quot;
              {form.values.username ? form.values.username : "\u2026"}&quot; clicks on the 'scan photos' button, photos in the directory that you specify here will be imported under the user's account
            </Text>
            <Space h="md" />
            <Grid grow>
              <Grid.Col span={9}>
                <TextInput
                  label="User's current directory"
                  labelProps={{ style: { fontWeight: "bold" } }}
                  ref={inputRef}
                  required={firstTimeSetup}
                  placeholder={scanDirectoryPlaceholder}
                  name="scan_directory"
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...form.getInputProps("scan_directory")}
                />
              </Grid.Col>
            </Grid>
            <Title order={6}>Choose a directory from below</Title>
            <div style={{ height: "150px", overflow: "auto" }}>
              <SortableTree
                innerStyle={{ outline: "none" }}
                canDrag={() => false}
                canDrop={() => false}
                treeData={treeData}
                onChange={setTreeData}
                theme={FileExplorerTheme}
                isVirtualized={false}
                generateNodeProps={(rowInfo: any) => ({
                  onClick: (event: Event) => nodeClicked(event, rowInfo),
                  className: selectedNodeId === rowInfo.node.id ? "selected-node" : undefined,
                })}
              />
            </div>
          </>
        )}
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
