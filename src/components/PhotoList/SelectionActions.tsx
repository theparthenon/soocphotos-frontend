import { ActionIcon, Group, Menu } from "@mantine/core";
import {
  IconAlbum as Album,
  IconDotsVertical as DotsVertical,
  IconDownload as Download,
  IconEye as Eye,
  IconEyeOff as EyeOff,
  IconFileMinus as FileMinus,
  IconPhoto as Photo,
  IconPlus as Plus,
  IconStar as Star,
  IconStarOff as StarOff,
  IconTrash as Trash,
} from "@tabler/icons-react";
import React from "react";

import { UserAlbum } from "@/@types/albums/user";
import { useRemovePhotoFromUserAlbumMutation } from "@/api/endpoints/albums/user";
import { useMarkPhotosDeletedMutation } from "@/api/endpoints/photos/delete";
import { useLazyDownloadPhotosQuery } from "@/api/endpoints/photos/download";
import { useSetFavoritePhotosMutation } from "@/api/endpoints/photos/favorite";
import { useSetPhotosHiddenMutation } from "@/api/endpoints/photos/visibility";
import { useAppSelector } from "@/store/store";

type Props = {
  selectedItems: UserAlbum[];
  updateSelectionState: (any) => void;
  setAlbumCover: (actionType: string) => void;
  onAddToAlbum: () => void;
  title: string;
  albumID: number;
};

export function SelectionActions(props: Readonly<Props>) {
  const route = useAppSelector(store => store.router);
  const [removePhotosFromAlbum] = useRemovePhotoFromUserAlbumMutation();
  const [setPhotosHidden] = useSetPhotosHiddenMutation();
  const [setPhotosFavorite] = useSetFavoritePhotosMutation();
  const [setPhotosDeleted] = useMarkPhotosDeletedMutation();
  const [downloadPhotoArchive] = useLazyDownloadPhotosQuery();

  const {
    selectedItems,
    updateSelectionState,
    title,
    setAlbumCover,
    albumID,
    onAddToAlbum,
  } = props;

  return (
    <Group>
      <Menu width={200}>
        <Menu.Target>
          <ActionIcon disabled={selectedItems.length === 0}>
            <Plus />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            Album {selectedItems.length} selected
          </Menu.Label>

          <Menu.Divider />

          <Menu.Item leftSection={<Album />} onClick={() => selectedItems.length > 0 && onAddToAlbum()}>
            {" Album"}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu width={200}>
        <Menu.Target>
          <ActionIcon>
            <DotsVertical />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            Photo Actions {selectedItems.length} selected
          </Menu.Label>

          <Menu.Divider />

          <Menu.Item
            leftSection={<Star />}
            disabled={selectedItems.length === 0}
            onClick={() => {
              setPhotosFavorite({
                image_hashes: selectedItems.map(i => i.id),
                favorite: true,
              });
              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Favorite
          </Menu.Item>

          <Menu.Item
            leftSection={<StarOff />}
            disabled={selectedItems.length === 0}
            onClick={() => {
              setPhotosFavorite({
                image_hashes: selectedItems.map(i => i.id),
                favorite: false,
              });

              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Unfavorite
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={<EyeOff />}
            disabled={selectedItems.length === 0}
            onClick={() => {
              setPhotosHidden({
                image_hashes: selectedItems.map(i => i.id),
                hidden: true,
              });

              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Hide
          </Menu.Item>

          <Menu.Item
            leftSection={<Eye />}
            disabled={selectedItems.length === 0}
            onClick={() => {
              setPhotosHidden({
                image_hashes: selectedItems.map(i => i.id),
                hidden: false,
              });

              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Unhide
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={<Download />}
            disabled={selectedItems.length === 0}
            onClick={() => {
              downloadPhotoArchive({ image_hashes: selectedItems.map(i => i.id) });

              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Download
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={<Trash />}
            disabled={selectedItems.length === 0}
            onClick={() => {
              setPhotosDeleted({ image_hashes: selectedItems.map(i => i.id), deleted: true });
              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Move to trash
          </Menu.Item>

          <Menu.Divider />


          <Menu.Label>Album Actions</Menu.Label>

          <Menu.Item
            disabled={
              (!route.location.pathname.startsWith("/person/") && !route.location.pathname.startsWith("/useralbum/")) ||
              selectedItems.length !== 1
            }
            leftSection={<Photo />}
            onClick={() => {
              if (route.location.pathname.startsWith("/person/")) {
                setAlbumCover("person");
              }
              if (route.location.pathname.startsWith("/albums/")) {
                setAlbumCover("useralbum");
              }
              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Set album cover
          </Menu.Item>

          <Menu.Item
            leftSection={<FileMinus />}
            disabled={!route.location.pathname.startsWith("/useralbum/") || selectedItems.length === 0}
            onClick={() => {
              removePhotosFromAlbum({
                id: albumID.toString(),
                title,
                photos: selectedItems.map(i => i.id),
              });
              updateSelectionState({
                selectMode: false,
                selectedItems: [],
              });
            }}
          >
            Remove Photos
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
