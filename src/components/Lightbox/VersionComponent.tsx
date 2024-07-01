import { Anchor, Button, Divider, Group, Modal, Stack, Text } from "@mantine/core";
import { IconPhoto as Photo } from "@tabler/icons-react";
import React, { useState } from "react";

import type { Photo as PhotoType } from "@/@types/photos";
import { serverAddress } from "@/api/apiClient";
import { useDeleteDuplicatePhotoMutation } from "@/api/endpoints/photos/delete";
import { useAppDispatch } from "@/store/store";
import { FileInfoComponent } from "./FileInfoComponent";

export function VersionComponent(props: Readonly<{ photoDetail: PhotoType }>) {
  const { photoDetail } = props;

  const [showMore, setShowMore] = useState(false);
  const [otherVersions] = useState<PhotoType[]>([]);
  const [openDeleteDialogState, setOpenDeleteDialogState] = useState(false);
  const [imageHash, setImageHash] = useState("");
  const [path, setPath] = useState("");
  const [deleteDuplicatePhoto] = useDeleteDuplicatePhotoMutation();

  const openDeleteDialog = (hash, filePath) => {
    setOpenDeleteDialogState(true);
    setImageHash(hash);
    setPath(filePath);
  };

  const dispatch = useAppDispatch();

  const duplicates = photoDetail.image_path.slice(1);

  return (
    <div>
      <Stack align="left">
        <Group justify="apart">
          <Group justify="left">
            <Photo />
            <div>
              <Anchor href={`${serverAddress}/media/photos/${photoDetail.image_hash}`} target="_blank">
                <Text lineClamp={1} style={{ maxWidth: 225, fontWeight: 800 }}>
                  {photoDetail.image_path[0].substring(photoDetail.image_path[0].lastIndexOf("/") + 1)}
                </Text>
              </Anchor>
              <Group>
                <FileInfoComponent info={`${photoDetail.height} x ${photoDetail.width}`} />
                {Math.round((photoDetail.size / 1024 / 1024) * 100) / 100 < 1 ? (
                  <FileInfoComponent info={`${Math.round((photoDetail.size / 1024) * 100) / 100} kB`} />
                ) : (
                  <FileInfoComponent info={`${Math.round((photoDetail.size / 1024 / 1024) * 100) / 100} MB`} />
                )}
              </Group>
            </div>
          </Group>
        </Group>
        {showMore && (
          <Stack>
            {
              // To-Do: Add a type e.g. RAW, serial image, ai etc
            }
            <FileInfoComponent description="File Path" info={`${photoDetail.image_path[0]}`} />

            {
              // To-Do: xmp should only be "Type: xmp" and the different file path if it's in a different folder
              // To-Do: Show if there is a jpeg to the raw file
              // To-Do: Differentiate XMPs and duplicates in the backend
            }
            {otherVersions.length > 0 && <Text style={{ fontWeight: 800 }}>Other Versions</Text>}
            {
              // To-Do: If there is more then one version, show them here
              // To-Do: If it is serial images, show a thumbnail, type and file path. Should be selectable as the current version
              // To-Do: Same goes for stable diffusion images or upressed images
            }
            {duplicates.length > 0 && <Text style={{ fontWeight: 800 }}>Duplicates</Text>}
            {duplicates.map(element => (
              <Stack>
                <FileInfoComponent description="File Path" info={`${element}`} />
                <Button color="red" onClick={() => openDeleteDialog(photoDetail.image_hash, element)}>
                  Delete
                </Button>
                {/**
                                 <Group>
                                 // To-Do: Change a path to the primary file
                                 // To-Do: Implement endpoint
                                 <Button color="green">Change to primary</Button>
                                 // To-Do: Use a ActionIcon instead?
                                 </Group> */}
                <Divider my="sm" />
              </Stack>
            ))}
          </Stack>
        )}
        <Button onClick={() => setShowMore(!showMore)} variant="subtle" size="xs">
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </Stack>
      <Modal
        opened={openDeleteDialogState}
        title="Delete Duplicate"
        onClose={() => setOpenDeleteDialogState(false)}
        zIndex={1000}
      >
        <Text size="sm">Delete this duplicate?</Text>
        <Group>
          <Button
            onClick={() => {
              setOpenDeleteDialogState(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              deleteDuplicatePhoto({ image_hash: imageHash, path });
              setOpenDeleteDialogState(false);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
