import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Collapse,
    Container,
    Dialog,
    Divider,
    Flex,
    Grid,
    Group,
    HoverCard,
    List,
    Loader,
    Menu,
    Modal,
    Space,
    Stack,
    Text,
    TextInput,
    Title,
  } from "@mantine/core";
  import { useDisclosure } from "@mantine/hooks";
  import {
    IconBook as Book,
    IconBrandNextcloud as BrandNextcloud,
    IconCheck as Check,
    IconChevronDown as ChevronDown,
    IconFaceId as FaceId,
    IconFolder as Folder,
    IconQuestionMark as QuestionMark,
    IconRefresh as Refresh,
    IconRefreshDot as RefreshDot,
    IconX as X,
  } from "@tabler/icons-react";
  import React, { useEffect, useState } from "react";

  import { scanAllPhotos, scanPhotos } from "@/actions/photosActions";
  import { deleteMissingPhotos } from "@/actions/utilActions";
  import { useGenerateAutoAlbumsMutation } from "@/api/endpoints/albums/auto";
  import { api, useWorkerQuery } from "@/api/api";
  import { serverAddress } from "@/api/apiClient";
  import { useUpdateUserMutation } from "@/api/endpoints/user";
  import { useFetchCountStatsQuery} from "@/api/endpoints/utils";
  import { COUNT_STATS_DEFAULTS } from "@/@types/utils";
  import { CountStats } from "@/components/Statistics";
  import { notification } from "@/services/notifications";
  import { useAppDispatch, useAppSelector } from "@/store/store";
  import { IUser } from "@/@types/user";

  function BadgeIcon(details: IUser, isSuccess: boolean, isError: boolean, isFetching: boolean) {
    if (isSuccess) {
      return <Check />;
    }
    if (isError) {
      return <X />;
    }
    if (isFetching) {
      return <RefreshDot />;
    }
    return <QuestionMark />;
  }

  export default function Library() {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [avatarImgSrc, setAvatarImgSrc] = useState("/unknown_user.jpg");
    const [userSelfDetails, setUserSelfDetails] = useState({} as any);
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const userSelfDetailsRedux = useAppSelector(state => state.user.userSelfDetails);
    const { data: worker } = useWorkerQuery();
    const [workerAvailability, setWorkerAvailability] = useState(false);
    const statusPhotoScan = useAppSelector(state => state.util.statusPhotoScan);
    const [generateAutoAlbums] = useGenerateAutoAlbumsMutation();
    const { data: countStats = COUNT_STATS_DEFAULTS } = useFetchCountStatsQuery();
    const [updateUser] = useUpdateUserMutation();

    const onPhotoScanButtonClick = () => {
      dispatch(scanPhotos());
    };

    const onPhotoFullScanButtonClick = () => {
      dispatch(scanAllPhotos());
    };

    const onGenerateEventAlbumsButtonClick = () => {
      dispatch({ type: "SET_WORKER_AVAILABILITY", payload: false });
      dispatch({
        type: "SET_WORKER_RUNNING_JOB",
        payload: { job_type_str: "Generate Event Albums" },
      });
      generateAutoAlbums();
    };

    const onDeleteMissingPhotosButtonClick = () => {
      dispatch(deleteMissingPhotos());
      close();
    };

    // open update dialog, when user was edited
    useEffect(() => {
      if (JSON.stringify(userSelfDetailsRedux) !== JSON.stringify(userSelfDetails)) {
        setIsOpenUpdateDialog(true);
      } else {
        setIsOpenUpdateDialog(false);
      }
    }, [userSelfDetailsRedux, userSelfDetails]);

    useEffect(() => {
      setUserSelfDetails(userSelfDetailsRedux);
    }, [userSelfDetailsRedux]);

    useEffect(() => {
      if (worker) {
        setWorkerAvailability(worker.queue_can_accept_job);
      }
    }, [worker]);

    if (avatarImgSrc === "/unknown_user.jpg") {
      if (userSelfDetails.avatar_url) {
        setAvatarImgSrc(serverAddress + userSelfDetails.avatar_url);
      }
    }

    return (
      <Container>
        <Flex align="baseline" justify="space-between">
          <Group gap="xs" style={{ marginBottom: 20, marginTop: 40 }}>
            <Book size={35} />
            <Title order={1}>Library</Title>
          </Group>
        </Flex>

        <Stack>
          <CountStats />
          <Card shadow="md">
            <Stack>
              <Title order={4} style={{ marginBottom: 16 }}>
                Photos
                {countStats.num_missing_photos > 0 && (
                  <HoverCard width={280} shadow="md">
                    <HoverCard.Target>
                      <Badge onClick={open} color="red" style={{ marginLeft: 10 }}>
                        {countStats.num_missing_photos} Missing Photos
                      </Badge>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="sm">
                        On every scan SOOC will check if the files are still in the same location or if they have been moved. If they are missing, then they get marked as such.
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                )}
                <Modal opened={isOpen} title="Remove Missing Photos" onClose={close}>
                  <Stack gap="xl">
                    This action will delete all missing photos and it&apos;s metadata from the database.
                    <Group>
                      <Button onClick={close}>Cancel</Button>
                      <Button color="red" onClick={onDeleteMissingPhotosButtonClick}>
                        Confirm
                      </Button>
                    </Group>
                  </Stack>
                </Modal>
              </Title>
              <Grid>
                <Grid.Col span={10}>
                  <Stack gap={0}>
                    <Group>
                      <Text>Scan Library</Text>
                    </Group>
                    <Text fz="sm" color="dimmed">
                      Scan for new files on your library
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Group gap={0}>
                    <Button
                      onClick={onPhotoScanButtonClick}
                      disabled={!workerAvailability}
                      leftSection={<Refresh />}
                      variant="filled"
                      className="libraryButton"
                    >
                      {statusPhotoScan.status && statusPhotoScan.added ? <Loader /> : null}
                      {statusPhotoScan.added
                        ? `Scanning photos (${statusPhotoScan.added}/${statusPhotoScan.to_add})`
                        : 'Scan'}
                    </Button>
                    <Menu transitionProps={{ transition: "pop" }}  withinPortal>
                      <Menu.Target>
                        <ActionIcon variant="filled" color="blue" size={36} className="libraryMenuControl">
                          <ChevronDown size="1rem" />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Refresh size="1rem" />} onClick={onPhotoFullScanButtonClick}>
                          {statusPhotoScan.status && statusPhotoScan.added ? <Loader /> : null}
                          {statusPhotoScan.added
                            ? `Scanning photos (${statusPhotoScan.added}/${
                                statusPhotoScan.to_add
                              })`
                            : 'Scan'}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Grid.Col>
              </Grid>
              <Divider
                style={{ fw: "bold", justifySelf: "left" }}
                label="Event Albums"
                mt={20}
                mb={10}
              />
              <Grid>
                <Grid.Col span={10}>
                  <Stack gap={0}>
                    <Text>Generate Event Albums</Text>
                    <Text fz="sm" color="dimmed">
                    The backend server will first group photos by time taken. If two consecutive photos are taken within 12 hours of each other, the two photos are considered to be from the same event. After groups are put together in this way, it automatically generates a title for this album.
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Button
                    onClick={onGenerateEventAlbumsButtonClick}
                    disabled={!workerAvailability}
                    leftSection={<RefreshDot />}
                    variant="outline"
                  >
                    Generate
                  </Button>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={10}>
                  <Stack gap={0}>
                    <Text>Regenerate Event Titles</Text>
                    <Text fz="sm" color="dimmed">
                        Automatically generated albums have names of people in the titles. If you trained your face classifier after making event albums, you can generate new titles for already existing event albums to reflect the new names associated with the faces in photos.
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Button
                    onClick={() => {
                      dispatch(api.endpoints.generateAutoAlbumTitle.initiate());
                      notification.regenerateEventAlbums();
                    }}
                    disabled={!workerAvailability}
                    leftSection={<RefreshDot />}
                    variant="outline"
                  >
                    Generate
                  </Button>
                </Grid.Col>
              </Grid>
            </Stack>
            <Divider
              style={{ fw: "bold", justifySelf: "left" }}
              label={'Faces & People'}
              mt={20}
              mb={10}
            />
            <Grid>
              <Grid.Col span={10}>
                <Stack gap={0}>
                  <Text>Train Faces</Text>
                  <Text fz="sm" color="dimmed">
                    Teach the system based on existing info.
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={2}>
                <Button
                  disabled={!workerAvailability}
                  onClick={() => {
                    dispatch(api.endpoints.trainFaces.initiate());
                    notification.trainFaces();
                  }}
                  leftSection={<FaceId />}
                  variant="outline"
                >
                  Train Faces
                </Button>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={10}>
                <Stack gap={0}>
                  <Text>Rescan Faces</Text>
                  <Text fz="sm" color="dimmed">
                    Look for faces in the library.
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={2}>
                <Button
                  disabled={!workerAvailability}
                  onClick={() => {
                    dispatch(api.endpoints.rescanFaces.initiate());
                    notification.rescanFaces();
                  }}
                  leftSection={<FaceId />}
                  variant="outline"
                >
                  Rescan
                </Button>
              </Grid.Col>
            </Grid>

            <Group mt={20} />
            <Space h="xl" />
          </Card>

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
        <Space h="xl" />
      </Container>
    );
  }
