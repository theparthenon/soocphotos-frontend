import {
    ActionIcon,
    Button,
    Divider,
    Group,
    Modal,
    SegmentedControl,
    Stack,
    Switch,
    Text,
    Tooltip,
  } from "@mantine/core";
  import {
    IconBarbell as Barbell,
    IconPlus as Plus,
    IconTrash as Trash,
    IconUserOff as UserOff,
  } from "@tabler/icons-react";
  import React, { useEffect, useState } from "react";

  import { api, useWorkerQuery } from "@/api/api";
  import { notification } from "@/services/notifications";
  import { faceActions } from "@/store/face/faceSlice";
  import { FacesOrderOption } from "@/@types/faces";
  import type { IFacesOrderOption } from "@/@types/faces";
  import { useAppDispatch, useAppSelector } from "@/store/store";

  type Props = Readonly<{
    selectMode: boolean;
    selectedFaces: any;
    changeSelectMode: () => void;
    addFaces: () => void;
    deleteFaces: () => void;
    notThisPerson: () => void;
  }>;

  export function ButtonHeaderGroup({
    selectMode,
    selectedFaces,
    changeSelectMode,
    addFaces,
    deleteFaces,
    notThisPerson,
  }: Props) {
    const [queueCanAcceptJob, setQueueCanAcceptJob] = useState(false);
    const [jobType, setJobType] = useState("");
    const { data: worker } = useWorkerQuery();
    const { orderBy } = useAppSelector(store => store.faces);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const dispatch = useAppDispatch();

    const setOrderBy = (value: string) => {
      dispatch(faceActions.changeFacesOrderBy(value as IFacesOrderOption));
    };

    useEffect(() => {
      if (worker) {
        setQueueCanAcceptJob(worker.queue_can_accept_job);
        setJobType(worker.job_detail?.job_type_str || "");
      }
    }, [worker]);

    return (
      <div>
        <Group justify="apart">
          <Group gap="xs">
            <Switch
              label={selectedFaces.length + " selected"}
              checked={selectMode}
              onChange={changeSelectMode}
            />
            <Divider orientation="vertical" style={{ height: "20px", marginTop: "10px" }} />
            <Text size="sm" style={{ fontWeight: 500 }} mb={3}>
              Sort By
            </Text>
            <SegmentedControl
              size="sm"
              value={orderBy}
              onChange={setOrderBy}
              data={[
                {
                  label: "Confidence",
                  value: FacesOrderOption.enum.confidence,
                },
                {
                  label: "Date",
                  value: FacesOrderOption.enum.date,
                },
              ]}
            />
          </Group>
          <Group>
            <Tooltip label="Add to an existing face ID or create a new face ID">
              <ActionIcon variant="light" color="green" disabled={selectedFaces.length === 0} onClick={addFaces}>
                <Plus />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Move the faces back to 'Unknown - Other'">
              <ActionIcon
                variant="light"
                color="orange"
                disabled={selectedFaces.length === 0}
                onClick={() => notThisPerson()}
              >
                <UserOff />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete the face and it's thumbnails">
              <ActionIcon
                variant="light"
                color="red"
                disabled={selectedFaces.length === 0}
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Trash />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Identify similar faces and try to find matches">
              <ActionIcon
                disabled={!queueCanAcceptJob}
                loading={jobType === "Train Faces"}
                color="blue"
                variant="light"
                onClick={() => {
                  dispatch(api.endpoints.trainFaces.initiate());
                  notification.trainFaces();
                }}
              >
                <Barbell />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <Modal opened={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} title={<h3>Delete Face</h3>}>
          <Stack>
          This action will permanently delete the faces and all its associated data. This action cannot be undone.
            <Group justify="center">
              <Button
                color="blue"
                onClick={() => {
                  setOpenDeleteDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => {
                  deleteFaces();
                  setOpenDeleteDialog(false);
                }}
              >
                Confirm
              </Button>
            </Group>
          </Stack>
        </Modal>
      </div>
    );
  }
