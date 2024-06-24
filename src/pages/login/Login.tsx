import {
    Button,
    Card,
    Center,
    Group,
    PasswordInput,
    Stack,
    TextInput,
    Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLock as Lock, IconUser as User } from "@tabler/icons-react";
import React, { useEffect } from 'react';
import type { FormEvent } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { useLoginMutation } from "@/api/api";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";
import { authActions } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import ColorSchemeToggle from "@/components/ColorSchemeToggle/ColorSchemeToggle";

export default function Login(): JSX.Element {
  const location = useLocation();
  const from = location.state?.from || '/';
  const navigate = useNavigate();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm({
      initialValues: {
        username: "",
        password: "",
      },
  });

  useEffect(() => {
    dispatch(authActions.clearError());
  }, [dispatch]);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    login({ username: form.values.username.toLowerCase(), password: form.values.password });
  }

  if (isAuth) {
    navigate(from);
  }

  return (
    <div className="loginPage">
      <Stack align="center" justify="flex-end">
        <Group>
          <span className="loginBrandTitle">
            SOOC Photos
          </span>
        </Group>
        <div className="loginForm">
          <Card>
            <Stack>
              <Title order={3}>Login</Title>
                <form onSubmit={onSubmit}>
                  <Stack>
                    <TextInput
                      required
                      leftSection={<User />}
                      placeholder="Username"
                      name="username"
                      {...form.getInputProps('username')}
                    />
                    <PasswordInput
                      required
                      leftSection={<Lock />}
                      placeholder="Password"
                      name="password"
                      {...form.getInputProps('password')}
                    />
                    <Button
                      variant="gradient"
                      gradient={{ from: "#43cea2", to: "#185a9d" }}
                      type="submit"
                    >
                      Login
                    </Button>
                  </Stack>
                </form>
            </Stack>
          </Card>
        </div>
      </Stack>
      <ColorSchemeToggle />
    </div>
  );
}