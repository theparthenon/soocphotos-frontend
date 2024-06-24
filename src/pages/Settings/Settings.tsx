import {
    Button,
    Card,
    Container,
    Dialog,
    Flex,
    Group,
    NumberInput,
    Radio,
    Select,
    Space,
    Stack,
    Switch,
    Text,
    Title,
  } from "@mantine/core";
  import { IconSettings as SettingIcon } from "@tabler/icons-react";
  import React, { useEffect, useState } from "react";

  import { api } from "@/api/api";
  import { useUpdateUserMutation } from "@/api/endpoints/user";
  import { useFetchTimezonesQuery } from "@/api/endpoints/utils";
  import { ConfigDateTime } from "@/components/Settings/ConfigDateTime";
  import { useAppDispatch, useAppSelector } from "@/store/store";

  export default function Settings() {
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const userSelfDetailsRedux = useAppSelector(state => state.user.userSelfDetails);
    const [userSelfDetails, setUserSelfDetails] = useState(userSelfDetailsRedux);
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const { data: timezoneList = [] } = useFetchTimezonesQuery();
    const [updateUser] = useUpdateUserMutation();

    // open update dialog, when user was edited
    useEffect(() => {
      if (JSON.stringify(userSelfDetailsRedux) !== JSON.stringify(userSelfDetails)) {
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

    return (
      <Container>
        <Group gap="xs" style={{ marginBottom: 20, marginTop: 40 }}>
          <SettingIcon size={35} />
          <Title order={1}>Settings</Title>
        </Group>
        <Stack>
          <Card shadow="md">
            <Title order={4} style={{ marginBottom: 16 }}>
              Scan Options
            </Title>
            <Flex align="flex-start" direction="column" gap="md">
              <Radio.Group
                description="Confidence Level"
                label="Scene Confidence"
                value={userSelfDetails.confidence?.toString() || "0"}
                onChange={value => {
                  setUserSelfDetails({ ...userSelfDetails, confidence: value || "0" });
                }}
              >
                <Group mt="xs">
                  <Radio value="0.5" label="High" />
                  <Radio value="0.1" label="Standard" />
                  <Radio value="0.05" label="Low" />
                  <Radio value="0" label="None" />
                </Group>
              </Radio.Group>
            </Flex>
          </Card>
          <Card shadow="md">
            <Title order={4} style={{ marginBottom: 16 }}>
              Metadata
            </Title>
            <Flex align="flex-start" direction="column" gap="md">
              <Radio.Group
                label="Synchronize Metadata To Disk"
                value={userSelfDetails.save_metadata_to_disk}
                onChange={value => {
                  setUserSelfDetails({ ...userSelfDetails, save_metadata_to_disk: value || "OFF" });
                }}
              >
                <Group mt="xs">
                  <Radio value="OFF" label="Off" />
                  <Radio value="SIDECAR_FILE" label="Save to sidecar" />
                  <Radio value="MEDIA_FILE" label="Save to media file" />
                </Group>
              </Radio.Group>
              <Radio.Group
                label="Minimum image rating to interpret as favorite"
                value={userSelfDetails.favorite_min_rating?.toString()}
                onChange={value => {
                  setUserSelfDetails({ ...userSelfDetails, favorite_min_rating: value || "3" });
                }}
              >
                <Group mt="xs">
                  <Radio value="1" label="1" />
                  <Radio value="2" label="2" />
                  <Radio value="3" label="3" />
                  <Radio value="4" label="4" />
                  <Radio value="5" label="5" />
                </Group>
              </Radio.Group>
              <Select
                label="Default Timezone"
                value={userSelfDetails.default_timezone}
                placeholder="Timezone"
                searchable
                title="This timezone is used for converting timestamps to the user's default timezone"
                onChange={value => {
                  setUserSelfDetails({ ...userSelfDetails, default_timezone: value ?? "UTC" });
                }}
                data={timezoneList}
              />
            </Flex>
          </Card>
          <Card shadow="md">
            <Title order={4} style={{ marginBottom: 16 }}>
              Album Options
            </Title>
            <NumberInput
              label="Inferred faces confidence"
              description= "Enter a confidence level between 0 and 1. For albums that display a person, inferred faces with a confidence level higher than this value will appear."
              min={0}
              max={1.0}
              placeholder="0.90"
              decimalScale={2}
              value={userSelfDetails.confidence_person}
              hideControls
              onChange={value => {
                setUserSelfDetails({ ...userSelfDetails, confidence_person: value });
              }}
            />
          </Card>
          <Card shadow="md">
            <Title order={4} style={{ marginBottom: 16 }}>
              Face Options
            </Title>
            <Radio.Group
              label="Face Recognition Model"
              description="Changes the model used for face recognition. The CNN model is more accurate but slower than the HOG model."
              value={userSelfDetails.face_recognition_model}
              onChange={value => {
                setUserSelfDetails({ ...userSelfDetails, face_recognition_model: value || "HOG" });
              }}
            >
              <Group mt="xs">
                <Radio value="HOG" label="HOG" />
                <Radio value="CNN" label="CNN" />
              </Group>
            </Radio.Group>
            <Radio.Group
              label="Minimum Cluster Size"
              description="Changes how clusters form. A smaller value results in more clusters being formed."
              value={userSelfDetails.min_cluster_size ? userSelfDetails.min_cluster_size.toString() : "0"}
              onChange={value => {
                setUserSelfDetails({ ...userSelfDetails, min_cluster_size: value || 0 });
              }}
            >
              <Group mt="xs">
                <Radio value="0" label="Auto" />
                <Radio value="2" label={2} />
                <Radio value="4" label={4} />
                <Radio value="8" label={8} />
                <Radio value="16" label={16} />
              </Group>
            </Radio.Group>
            <Radio.Group
              label="Minimum Samples"
              description="Changes how conservative clusters are. A smaller value means less conservative."
              value={userSelfDetails.min_samples ? userSelfDetails.min_samples.toString() : "1"}
              onChange={value => {
                setUserSelfDetails({ ...userSelfDetails, min_samples: value || 0 });
              }}
            >
              <Group mt="xs">
                <Radio value="1" label={1} />
                <Radio value="2" label={2} />
                <Radio value="4" label={4} />
                <Radio value="8" label={8} />
                <Radio value="16" label={16} />
              </Group>
            </Radio.Group>
            <Radio.Group
              label="Cluster Selection Epsilon"
              description="Determines which clusters get merged. A higher value means more clusters will be merged."
              value={
                userSelfDetails.cluster_selection_epsilon ? userSelfDetails.cluster_selection_epsilon.toString() : "0.1"
              }
              onChange={value => {
                setUserSelfDetails({ ...userSelfDetails, cluster_selection_epsilon: value || 0 });
              }}
            >
              <Group mt="xs">
                <Radio value="0" label="Auto" />
                <Radio value="0.025" label="Small" />
                <Radio value="0.05" label="Normal" />
                <Radio value="0.1" label="High" />
                <Radio value="0.2" label="Very High" />
              </Group>
            </Radio.Group>
            <NumberInput
              label="Confidence when Matching Unknown - Other Faces"
              description="Enter a confidence level between 0 and 1. Faces from 'Unknown - Other' will be matched to other persons if the confidence level is higher than this value. 0 means that this feature is disabled."
              min={0}
              max={1.0}
              placeholder="0.50"
              decimalScale={2}
              value={userSelfDetails.confidence_unknown_face}
              hideControls
              onChange={value => {
                setUserSelfDetails({ ...userSelfDetails, confidence_unknown_face: value });
              }}
            />
          </Card>
          <Card shadow="md">
            <ConfigDateTime
              value={userSelfDetails.datetime_rules}
              onChange={value => {
                setUserSelfDetails({ ...userSelfDetails, datetime_rules: value || "[]" });
              }}
            />
          </Card>
          <Card shadow="md">
            <Title order={4} style={{ marginBottom: 16 }}>
              Experimental Options
            </Title>
            <Switch
              label="Transcode Video"
              checked={userSelfDetails.transcode_videos}
              onChange={event => {
                setUserSelfDetails({
                  ...userSelfDetails,
                  transcode_videos: event.currentTarget.checked,
                });
              }}
            />
          </Card>
          <Card shadow="md">
            <Stack>
              <Title order={4} style={{ marginBottom: 16 }}>
                Large Language Model Settings
              </Title>
              <Switch
                label="Enable Large Language Model For Captions"
                checked={userSelfDetails.llm_settings?.enabled}
                onChange={event => {
                  setUserSelfDetails({
                    ...userSelfDetails,
                    llm_settings: {
                      ...userSelfDetails.llm_settings,
                      enabled: event.currentTarget.checked,
                    },
                  });
                }}
              />
              <Switch
                label="Add People to the Captions"
                checked={userSelfDetails.llm_settings?.add_person}
                disabled={!userSelfDetails.llm_settings?.enabled}
                onChange={event => {
                  setUserSelfDetails({
                    ...userSelfDetails,
                    llm_settings: {
                      ...userSelfDetails.llm_settings,
                      add_person: event.currentTarget.checked,
                    },
                  });
                }}
              />
              <Switch
                label="Add Locations to the Captions"
                checked={userSelfDetails.llm_settings?.add_location}
                disabled={!userSelfDetails.llm_settings?.enabled}
                onChange={event => {
                  setUserSelfDetails({
                    ...userSelfDetails,
                    llm_settings: {
                      ...userSelfDetails.llm_settings,
                      add_location: event.currentTarget.checked,
                    },
                  });
                }}
              />
            </Stack>
          </Card>
          <Space h="xl" />
        </Stack>
        <Dialog
          opened={isOpenUpdateDialog}
          withCloseButton
          onClose={() => setIsOpenUpdateDialog(false)}
          size="lg"
          radius="md"
        >
          <Text size="sm" style={{ marginBottom: 10, fontWeight: 500 }}>
            Save Changes
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
                setUserSelfDetails(userSelfDetailsRedux);
                setIsOpenUpdateDialog(false);
              }}
              size="sm"
            >
              Cancel
            </Button>
          </Group>
        </Dialog>
      </Container>
    );
  }
