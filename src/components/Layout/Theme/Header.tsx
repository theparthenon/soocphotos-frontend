import { Avatar, Burger, AppShell, Grid, Group, Menu } from "@mantine/core";
import {
    IconAdjustments as Adjustments,
    IconBook as Book,
    IconLogout as Logout,
    IconSettings as Settings,
    IconUser as User,
} from "@tabler/icons-react";
import { push } from "redux-first-history";

import { api } from "@/api/api";
import { logout } from "@/store/auth/authSlice";
import Search from "./HeaderSearch";
import { ChunkedUploadButton } from "./ChunkedUploadButton";
import { WorkerIndicator } from "./WorkerIndicator";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { serverAddress } from "@/api/apiClient";

type Props = Readonly<{
    opened: boolean;
    toggle: () => void;
  }>;

export default function Header({opened, toggle}: Props) {
    const dispatch = useAppDispatch();
    const userSelfDetails = useAppSelector(state => state.user.userSelfDetails);
    const auth = useAppSelector(state => state.auth);

    return (
        <AppShell.Header px={10}>
            <div className="headerInner">
                <Grid justify="space-between" grow style={{ paddingTop: 5 }}>
                    <Grid.Col span={2}>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            size="sm"
                            className="headerBurger"
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Search />
                    </Grid.Col>
                    <Grid.Col span={1}>
                    <Group justify="right" style={{ height: "100%" }}>
                        <ChunkedUploadButton />
                        <WorkerIndicator />

                        <Menu width={200}>
                        <Menu.Target>
                            <Group gap="xs" style={{ cursor: "pointer" }}>
                            <Avatar
                                src={
                                userSelfDetails && userSelfDetails.avatar_url
                                    ? serverAddress + userSelfDetails.avatar_url
                                    : "/unknown_user.jpg"
                                }
                                size={25}
                                alt="it's me"
                                radius="xl"
                            />
                            </Group>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>
                                Logged in as {auth.access ? auth.access.name : ""}
                            </Menu.Label>

                            <Menu.Item
                                leftSection={<Book />}
                                onClick={() => dispatch(push("/settings/library"))}
                            >
                                Library
                            </Menu.Item>

                            <Menu.Item
                                leftSection={<User />}
                                onClick={() => dispatch(push("/settings/profile"))}
                            >
                                Profile
                            </Menu.Item>

                            <Menu.Item
                                leftSection={<Settings />}
                                onClick={() => dispatch(push("/settings"))}
                            >
                                Settings
                            </Menu.Item>

                            {auth.access && auth.access.is_admin && <Menu.Divider />}

                            {auth.access && auth.access.is_admin && (
                                <Menu.Item
                                    leftSection={<Adjustments />}
                                    onClick={() => dispatch(push("/admin"))}
                                >
                                    Admin
                                </Menu.Item>
                            )}

                            <Menu.Item
                                leftSection={<Logout />}
                                onClick={() => {
                                    dispatch(logout());
                                    dispatch(api.util.resetApiState());
                                }}
                            >
                            Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                        </Menu>
                    </Group>
                    </Grid.Col>
                </Grid>
            </div>
        </AppShell.Header>
    );
}