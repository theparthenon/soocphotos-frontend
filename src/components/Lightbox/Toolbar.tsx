import { ActionIcon, Group, Loader } from "@mantine/core";
import {
  IconEye as Eye,
  IconEyeOff as EyeOff,
  IconGlobe as Globe,
  IconInfoCircle as InfoCircle,
  IconPlayerPause as PlayerPause,
  IconPlayerPlay as PlayerPlay,
  IconStar as Star,
} from "@tabler/icons-react";
import React from "react";

import { shareAddress } from "@/api/apiClient";
import { useSetFavoritePhotosMutation } from "@/api/endpoints/photos/favorite";
import { useSetPhotosHiddenMutation } from "@/api/endpoints/photos/visibility";
import { playerActions } from "@/store/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { copyToClipboard } from "@/utils/utils";

type Props = Readonly<{
  photosDetail: any;
  lightboxSidebarShow: boolean;
  closeSidepanel: () => void;
}>;

export function Toolbar(props: Props) {
  const dispatch = useAppDispatch();
  const { favorite_min_rating: favoriteMinRating } = useAppSelector(store => store.user.userSelfDetails);
  const { photosDetail, lightboxSidebarShow, closeSidepanel } = props;
  const { playing: playerPlaying, loading: playerLoading } = useAppSelector(store => store.player);
  const [setPhotosHidden] = useSetPhotosHiddenMutation();
  const [setFavoritePhotos] = useSetFavoritePhotosMutation();

  function playButton(photo) {
    if (!photo) {
      return null;
    }
    function togglePlay() {
      if (playerPlaying) {
        dispatch(playerActions.pause());
      } else {
        dispatch(playerActions.play());
      }
    }
    return (
      <ActionIcon onClick={() => togglePlay()}>
        {playerLoading && <Loader color="grey" />}
        {!playerLoading && playerPlaying ? <PlayerPause color="grey" /> : <PlayerPlay color="grey" />}
      </ActionIcon>
    );
  }

  return (
    <Group style={{ paddingBottom: 10, paddingRight: 5 }}>
      {!photosDetail && (
        <ActionIcon loading>
          <Eye color="grey" />
        </ActionIcon>
      )}
      {!photosDetail && (
        <ActionIcon loading>
          <Star color="grey" />
        </ActionIcon>
      )}
      {!photosDetail && (
        <ActionIcon loading>
          <Globe color="grey" />
        </ActionIcon>
      )}
      {playButton(photosDetail)}
      {photosDetail && (
        <ActionIcon
          onClick={() => {
            const { image_hash: imageHash } = photosDetail;
            const val = !photosDetail.hidden;
            setPhotosHidden({ image_hashes: [imageHash], hidden: val });
          }}
        >
          {photosDetail.hidden ? <EyeOff color="red" /> : <Eye color="grey" />}
        </ActionIcon>
      )}
      {photosDetail && (
        <ActionIcon
          onClick={() => {
            const { image_hash: imageHash } = photosDetail;
            const val = !(photosDetail.rating >= favoriteMinRating);
            setFavoritePhotos({ image_hashes: [imageHash], favorite: val });
          }}
        >
          <Star color={photosDetail.rating >= favoriteMinRating ? "yellow" : "grey"} />
        </ActionIcon>
      )}
      <ActionIcon onClick={() => closeSidepanel()}>
        <InfoCircle color={lightboxSidebarShow ? "white" : "grey"} />
      </ActionIcon>
    </Group>
  );
}
