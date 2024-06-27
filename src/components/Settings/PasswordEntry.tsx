import { ActionIcon, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { IconLock as Lock, IconLockOpen as LockOpen } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

type Props = Readonly<{
  createNew?: boolean;
  onValidate: (string, boolean) => void;
  closing?: boolean;
}>;

export function PasswordEntry({createNew = false, onValidate, closing = false }: Props): JSX.Element {
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateAndUpdatePassword = (password, passwordConfirm, isClosing = false) => {
    setConfirmPasswordError("");
    setNewPasswordError("");
    let validPassword = "";
    let isValid = false;

    if (password || passwordConfirm) {
      if (password === passwordConfirm) {
        validPassword = password;
        isValid = true;
      } else if (passwordConfirm !== "") {
        setConfirmPasswordError("Passwords do not match");
      } else if (isClosing) {
        setConfirmPasswordError("Please retype your password");
      }
    } else if (editPasswordMode || createNew) {
      setNewPasswordError("Please enter a password");
    } else {
      isValid = true;
    }

    onValidate(validPassword, isValid);
  };

  useEffect(() => {
    validateAndUpdatePassword(newPassword, newPasswordConfirm, closing);
  }, [createNew, closing, editPasswordMode]);

  return (
    <Stack style={{ display: "flex", alignContent: "stretch" }} gap="xs">
      <Title order={6}>
        {createNew ? (
          <Text>Reset Password</Text>
        ) : (
          <Text style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Change Password
            <ActionIcon
              title="Click to change the password"
              color="blue"
              variant={editPasswordMode ? "outline" : "filled"}
              component="span"
              style={{ marginLeft: "5px" }}
              onClick={() => {
                setEditPasswordMode(!editPasswordMode);
              }}
            >
              {editPasswordMode ? <LockOpen size={16} /> : <Lock size={16} />}
            </ActionIcon>
          </Text>
        )}
      </Title>

      <PasswordInput
        leftSection={<Lock />}
        placeholder="Password"
        name="password"
        disabled={!editPasswordMode && !createNew}
        required={editPasswordMode}
        value={newPassword}
        error={newPasswordError}
        onChange={event => {
          setNewPassword(event.currentTarget.value);
          validateAndUpdatePassword(event.currentTarget.value, newPasswordConfirm);
        }}
      />
      <PasswordInput
        leftSection={<Lock />}
        placeholder="Confirm Password"
        name="passwordConfirm"
        disabled={!editPasswordMode && !createNew}
        required={editPasswordMode}
        value={newPasswordConfirm}
        error={confirmPasswordError}
        onChange={event => {
          setNewPasswordConfirm(event.currentTarget.value);
          validateAndUpdatePassword(newPassword, event.currentTarget.value);
        }}
      />
    </Stack>
  );
}