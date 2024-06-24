import {
    Button,
    Card,
    Container,
    Dialog,
    Group,
    Radio,
    Select,
    Space,
    Stack,
    Text,
    TextInput,
    Title,
    useMantineColorScheme,
  } from "@mantine/core";
  import { IconPhoto as Photo, IconUpload as Upload, IconUser as User } from "@tabler/icons-react";
  import _ from "lodash";
  import React, { useEffect, useRef, useState } from "react";
  import AvatarEditor from "react-avatar-editor";
  import type { DropzoneRef } from "react-dropzone";
  import Dropzone from "react-dropzone";

  import { api } from "@/api/api";
  import { serverAddress } from "@/api/apiClient";
  import { useUpdateAvatarMutation, useUpdateUserMutation } from "@/api/endpoints/user";
  import { PasswordEntry } from "@/components/Settings/PasswordEntry";
  import { useAppDispatch, useAppSelector } from "@/store/store";

  export default function Profile() {
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [avatarImgSrc, setAvatarImgSrc] = useState("/unknown_user.jpg");
    const [userSelfDetails, setUserSelfDetails] = useState({} as any);
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const userSelfDetailsRedux = useAppSelector(state => state.user.userSelfDetails);
    const [updateAvatar] = useUpdateAvatarMutation();
    const [updateUser] = useUpdateUserMutation();

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";
    let editorRef = useRef(null);

    const setEditorRef = ref => {
      editorRef = ref;
    };

    let dropzoneRef = React.useRef<DropzoneRef>();

    const urlToFile = async (url: string, filename: string, mimeType = undefined) => {
      const type = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      return new File([buf], filename, { type });
    };

    const onPasswordValidate = (pass: string, valid: boolean) => {
      const newUserDetails = { ...userSelfDetails };
      if (pass && valid) {
        newUserDetails.password = pass;
      } else {
        delete newUserDetails.password;
      }

      setUserSelfDetails({ ...newUserDetails });
    };

    // open update dialog, when user was edited
    useEffect(() => {
      if (!_.isEqual(userSelfDetailsRedux, userSelfDetails)) {
        setIsOpenUpdateDialog(true);
      } else {
        setIsOpenUpdateDialog(false);
      }
    }, [userSelfDetailsRedux, userSelfDetails]);

    useEffect(() => {
      dispatch(api.endpoints.fetchUserSelfDetails.initiate(auth.access.user_id)).refetch();
    }, [auth.access.user_id, dispatch]);

    useEffect(() => {
      setUserSelfDetails(userSelfDetailsRedux);
    }, [userSelfDetailsRedux]);

    if (avatarImgSrc === "/unknown_user.jpg") {
      if (userSelfDetails.avatar_url) {
        setAvatarImgSrc(serverAddress + userSelfDetails.avatar_url);
      }
    }
    return (
      <Container>
        <Group gap="xs" style={{ marginBottom: 20, marginTop: 40 }}>
          <User size={35} />
          <Title order={1}>Profile</Title>
        </Group>
        <Stack>
          <Card shadow="md">
            <Title order={4} mb={10}>
              User
            </Title>
            <Title order={5}>Avatar</Title>
            <Group justify="center" align="self-start" grow mb="lg">
              <div>
                <Dropzone
                  noClick
                  // @ts-ignore
                  style={{ width: 150, height: 150, borderRadius: 75 }}
                  ref={node => {
                    // @ts-ignore
                    dropzoneRef = node;
                  }}
                  onDrop={accepted => {
                    setAvatarImgSrc(URL.createObjectURL(accepted[0]));
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <div {...getRootProps()}>
                      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                      <input {...getInputProps()} />
                      <AvatarEditor ref={setEditorRef} width={150} height={150} border={0} image={avatarImgSrc} />
                    </div>
                  )}
                </Dropzone>
              </div>
              <div>
                <Title order={4} mb={10}>
                  Upload New Avatar
                </Title>
                <Group>
                  <Button
                    size="sm"
                    onClick={() => {
                      // @ts-ignore
                      dropzoneRef.open();
                    }}
                  >
                    <Photo />
                    Choose image
                  </Button>
                  <Button
                    size="sm"
                    color="green"
                    onClick={async () => {
                      const formData = new FormData();
                      const file = await urlToFile(
                        // @ts-ignore
                        editorRef.getImageScaledToCanvas().toDataURL(),
                        `${userSelfDetails.first_name}avatar.png`
                      );
                      formData.append("avatar", file, `${userSelfDetails.first_name}avatar.png`);
                      updateAvatar({ id: userSelfDetails.id, data: formData });
                    }}
                  >
                    <Upload />
                    Upload
                  </Button>
                </Group>
                <p>
                  The maximum file size allowed is 200KB.
                </p>
              </div>
            </Group>
            <Title order={5}>Account</Title>
            <Group grow>
              <TextInput
                onChange={event => {
                  setUserSelfDetails({ ...userSelfDetails, first_name: event.currentTarget.value });
                }}
                label="First Name"
                placeholder="First Name"
                value={userSelfDetails.first_name}
              />
              <TextInput
                onChange={event => {
                  setUserSelfDetails({ ...userSelfDetails, last_name: event.currentTarget.value });
                }}
                label="Last Name"
                placeholder="Last Name"
                value={userSelfDetails.last_name}
              />
              <TextInput
                label="Email"
                placeholder="Email"
                value={userSelfDetails.email}
                onChange={event => {
                  setUserSelfDetails({ ...userSelfDetails, email: event.currentTarget.value });
                }}
              />
            </Group>
          </Card>

          <Card shadow="md">
            <Title order={4}>Security</Title>
            <PasswordEntry onValidate={onPasswordValidate} createNew={false} />
          </Card>

          <Card shadow="md">
            <Title order={4} mb={10}>
              Appearance
            </Title>

            <Stack align="flex-start">

              <Radio.Group
                label="Color Scheme"
                value={dark ? "1" : "0"}
                onChange={() => {
                  toggleColorScheme();
                }}
              >
                <Group mt="xs">
                  <Radio value="1" label="Dark" />
                  <Radio value="0" label="Light" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
          <Space h="xl" />
          <Dialog
            opened={isOpenUpdateDialog}
            withCloseButton
            onClose={() => setIsOpenUpdateDialog(false)}
            size="lg"
            radius="md"
          >
            <Text size="sm" style={{ marginBottom: 10, fontWeight: 500 }}>
              Save Changes?
            </Text>

            <Group align="flex-end">
              <Button
                size="sm"
                color="green"
                onClick={() => {
                  const newUserData = userSelfDetails;
                  delete newUserData.avatar;
                  updateUser(newUserData);
                  setIsOpenUpdateDialog(false);
                }}
              >
                Update Profile Settings
              </Button>
              <Button
                onClick={() => {
                  setUserSelfDetails(userSelfDetails);
                }}
                size="sm"
              >
                Cancel
              </Button>
            </Group>
          </Dialog>
        </Stack>
      </Container>
    );
  }
