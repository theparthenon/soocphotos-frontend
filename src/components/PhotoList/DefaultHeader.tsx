import { Button, Group, Loader, Menu, Stack, Text, Title } from "@mantine/core";
import {
  IconCalendar as Calendar,
  IconChevronDown as ChevronDown,
  IconClock as Clock,
  IconEyeOff as EyeOff,
  IconPhoto as Photo,
  IconStar as Star,
  IconVideo as Video,
} from "@tabler/icons-react";
import { DateTime } from "luxon";
import type { ReactElement } from "react";
import React, { useState } from "react";
import { push } from "redux-first-history";

import { useFetchUserListQuery } from "@/api/api";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ModalUserEdit } from "../Modals/ModalUserEdit";
import { LOCALE } from "@/constants/api.constant";

type Props = Readonly<{
    loading: boolean;
    numPhotosetItems: number;
    numPhotos: number;
    icon: ReactElement;
    title: string;
    additionalSubHeader: string;
    dayHeaderPrefix: string;
    date: string;
  }>;

  export function DefaultHeader(props: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState({});

    const auth = useAppSelector(state => state.auth);
    const user = useAppSelector(store => store.user.userSelfDetails);
    const route = useAppSelector(store => store.router);
    const dispatch = useAppDispatch();

    const { data: userList } = useFetchUserListQuery();

    // return true if it is a view with a dropdown
    const isMenuView = () => {
      // @ts-ignore
      const path = route.location.pathname;
      return (
        path === "/" ||
        path.endsWith("/hidden") ||
        path.endsWith("/favorites") ||
        path.endsWith("/without-timestamps") ||
        path.endsWith("/recently-added") ||
        path.startsWith("/user/") ||
        path.startsWith("/photos") ||
        path.startsWith("/videos")
      );
    };

    const isScanView = () => route.location.pathname === "/";

    const { loading, numPhotosetItems, icon, numPhotos, title, additionalSubHeader, date, dayHeaderPrefix } = props;

    function getPhotoCounter() {
      if (loading || numPhotosetItems < 1) {
        return (
          <Text style={{ textAlign: "left" }} color="dimmed">
            {loading ? "Loading..." : null}
            {!loading && numPhotosetItems < 1 ? "No images found" : null}
            {loading ? <Loader size={20} /> : null}
          </Text>
        );
      }

      return (
        <Text style={{ textAlign: "left" }} color="dimmed">
          {numPhotosetItems !== numPhotos ? `${numPhotosetItems} "days", ` : ""}
          {numPhotos} photos
          {additionalSubHeader}
        </Text>
      );
    }

    if (!loading && auth.access && isScanView() && auth.access.is_admin && !user.scan_directory  && numPhotosetItems < 1) {
      return (
        <Stack align="center">
          <Title order={3}>To begin using, edit your user's scan directory.</Title>
          <Button
            color="green"
            onClick={() => {
              setUserToEdit({ ...user });
              setModalOpen(true);
            }}
          >
            Edit User
          </Button>
          <ModalUserEdit
            onRequestClose={() => {
              setModalOpen(false);
            }}
            userToEdit={userToEdit}
            isOpen={modalOpen}
            updateAndScan
            userList={userList}
            createNew={false}
            firstTimeSetup
          />
        </Stack>
      );
    }

    return (
      <div>
        <Group justify="apart">
          <Group justify="left">
            {icon}
            <div>
              {auth.access && isMenuView() && auth.access.is_admin ? (
                <Menu>
                  <Menu.Target>
                    <Title style={{ minWidth: 200, textAlign: "left" }} order={2}>
                      {title} <ChevronDown size={20} />
                    </Title>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item leftSection={<Calendar color="green" size={14} />} onClick={() => dispatch(push("/photos/with-timestamps"))}>
                      With Timestamp
                    </Menu.Item>

                    <Menu.Item leftSection={<Calendar color="red" size={14} />} onClick={() => dispatch(push("/photos/without-timestamps"))}>
                      Without Timestamp
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item leftSection={<Clock size={14} />} onClick={() => dispatch(push("/photos/recently-added"))}>
                      Recently Added
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item leftSection={<EyeOff color="red" size={14} />} onClick={() => dispatch(push("/photos/hidden"))}>
                      Hidden
                    </Menu.Item>

                    <Menu.Item leftSection={<Star color="yellow" size={14} />} onClick={() => dispatch(push("/photos/favorites"))}>
                      Favorites
                    </Menu.Item>

                    <Menu.Item leftSection={<Photo color="blue" size={14} />} onClick={() => dispatch(push("/photos"))}>
                      Photos
                    </Menu.Item>

                    <Menu.Item leftSection={<Video color="pink" size={14} />} onClick={() => dispatch(push("/videos"))}>
                      Videos
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Title style={{ textAlign: "left" }} order={2}>
                  {title}
                </Title>
              )}
              {getPhotoCounter()}
            </div>
          </Group>
          <Group justify="right">
            <Text>
              <b>
                {dayHeaderPrefix}
                {DateTime.fromISO(date).isValid
                  ? DateTime.fromISO(date).setLocale(LOCALE).toLocaleString(DateTime.DATE_HUGE)
                  : date}
              </b>
            </Text>
          </Group>
        </Group>
      </div>
    );
  }
