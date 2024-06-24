import { Button, Divider, Group, Modal, Stack, Text, TextInput, Title, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

import {
  useAddPhotoToUserAlbumMutation,
  useCreateUserAlbumMutation,
  useFetchUserAlbumsQuery,
} from "@/api/endpoints/albums/user";
import { fuzzyMatch } from "@/utils/utils";
import { Tile } from "@/components/Tile";
import { LOCALE } from "@/constants/api.constant";

type Props = Readonly<{
  isOpen: boolean;
  onRequestClose: () => void;
  selectedImages: any[];
}>;

export function ModalAlbumEdit(props: Props) {
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const matches = useMediaQuery("(min-width: 700px)");
  const { isOpen, onRequestClose, selectedImages } = props;
  const { data: albumsUserList = [] } = useFetchUserAlbumsQuery();
  const [createUserAlbum] = useCreateUserAlbumMutation();
  const [addPhotoToUserAlbum] = useAddPhotoToUserAlbumMutation();
  const [filteredUserAlbumList, setFilteredUserAlbumList] = useState(albumsUserList);

  useEffect(() => {
    if (albumsUserList && newAlbumTitle) {
      setFilteredUserAlbumList(albumsUserList.filter(el => fuzzyMatch(newAlbumTitle, el.title)));
    }
  }, [albumsUserList, newAlbumTitle]);

  return (
    <Modal
      zIndex={1500}
      opened={isOpen}
      title={<Title>Add to Album</Title>}
      onClose={() => {
        onRequestClose();
        setNewAlbumTitle("");
      }}
    >
      <Stack>
        <Text color="dimmed">Add {selectedImages.length} photo(s) to...</Text>
        <Group>
          {selectedImages.map(image => (
            <Tile
              key={`si-${image.id}`}
              style={{ objectFit: "cover" }}
              height={40}
              width={40}
              image_hash={image.id}
              video={image.type === "video"}
            />
          ))}
        </Group>
        <Divider />
        <Title order={4}>New Album</Title>
        <Group>
          <TextInput
            error={
              albumsUserList.map(el => el.title.toLowerCase().trim()).includes(newAlbumTitle.toLowerCase().trim())
                ? "Album " + newAlbumTitle + " already exists."
                : ""
            }
            onChange={v => {
              setNewAlbumTitle(v.currentTarget.value);
            }}
            placeholder="Album Title"
          />
          <Button
            onClick={() => {
              createUserAlbum({
                title: newAlbumTitle,
                photos: selectedImages.map(i => i.id),
              });
              onRequestClose();
              setNewAlbumTitle("");
            }}
            disabled={albumsUserList
              .map(el => el.title.toLowerCase().trim())
              .includes(newAlbumTitle.toLowerCase().trim())}
            type="submit"
          >
            Create
          </Button>
        </Group>
        <Divider />
        <Stack style={{ height: matches ? "50vh" : "25vh", overflowY: "scroll" }}>
          {filteredUserAlbumList.length > 0 &&
            filteredUserAlbumList.map(item => (
              <UnstyledButton
                key={`ub-${item.id}`}
                onClick={() => {
                  addPhotoToUserAlbum({
                    id: `${item.id}`,
                    title: item.title,
                    photos: selectedImages.map(i => i.id),
                  });
                  onRequestClose();
                }}
              >
                <Group>
                  <Tile
                    height={50}
                    width={50}
                    style={{ objectFit: "cover" }}
                    image_hash={item.cover_photo.image_hash}
                    video={item.cover_photo.video}
                  />
                  <div>
                    <Title order={4}>{item.title}</Title>
                    <Text size="sm" color="dimmed">
                      {item.photo_count} Item(s)
                      <br />
                      Updated {DateTime.fromISO(item.created_on).setLocale(LOCALE).toRelative()}
                      {}
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            ))}
        </Stack>
      </Stack>
    </Modal>
  );
}
