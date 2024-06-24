import { ActionIcon, Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
// only needs to be imported once
import {
  IconArrowBackUp as ArrowBackUp,
  IconCalendar as Calendar,
  IconCheck as Check,
  IconEdit as Edit,
  IconX as X,
} from "@tabler/icons-react";
import { DateTime } from "luxon";
import React, { useState } from "react";
import "react-virtualized/styles.css";

import { editPhoto } from "../../actions/photosActions";
import { useAppDispatch } from "../../store/store";
import { LOCALE } from "@/constants/api.constant";

type Props = Readonly<{
  photoDetail: any;
}>;

export function TimestampItem({ photoDetail }: Props) {
  const [timestamp, setTimestamp] = useState(
    photoDetail.exif_timestamp === null ? null : new Date(photoDetail.exif_timestamp)
  );

  // savedTimestamp is used to cancel timestamp modification
  const [savedTimestamp, setSavedTimestamp] = useState(timestamp);
  const [previousSavedTimestamp, setPreviousSavedTimestamp] = useState(timestamp);
  const [editMode, setEditMode] = useState(false);

  import(
    /* @vite-ignore */
    `dayjs/locale/en.js`
  );

  const dispatch = useAppDispatch();

  const onChangeDate = (date: Date) => {
    if (date && timestamp) {
      date.setHours(timestamp.getHours());
      date.setMinutes(timestamp.getMinutes());
      date.setSeconds(timestamp.getSeconds());
    }
    setTimestamp(date);
  };

  const onChangeTime = (date: Date) => {
    if (date && timestamp) {
      date.setDate(timestamp.getDate());
      date.setMonth(timestamp.getMonth());
      date.setFullYear(timestamp.getFullYear());
    }
    setTimestamp(date);
  };

  const onSaveDateTime = () => {
    // To-Do: Use the user defined timezone
    const differentJson = { exif_timestamp: timestamp === null ? null : timestamp.toISOString() };
    dispatch(editPhoto(photoDetail.image_hash, differentJson));
    setEditMode(false);
  };

  const onCancelDateTime = () => {
    setTimestamp(savedTimestamp);
    setSavedTimestamp(previousSavedTimestamp);
    setEditMode(false);
  };

  const getDateTimeLabel = () => {
    if (!photoDetail.exif_timestamp) return "Without Timestamp";

    const photoDateTime = DateTime.fromISO(photoDetail.exif_timestamp);
    if (photoDateTime.isValid) {
      const date = DateTime.fromISO(photoDetail.exif_timestamp).setLocale(LOCALE).toLocaleString(DateTime.DATE_MED);
      const dayOfWeek = DateTime.fromISO(photoDetail.exif_timestamp).setLocale(LOCALE).toFormat("cccc");
      const time = DateTime.fromISO(photoDetail.exif_timestamp).setLocale(LOCALE).toLocaleString(DateTime.TIME_SIMPLE);
      return (
        <div>
          {date}{" "}
          <Text size="xs" color="dimmed">
            {dayOfWeek}, {time}
          </Text>
        </div>
      );
    }
    return "lightbox.sidebar.invalidtimestamp";
  };

  const onActivateEditMode = () => {
    setPreviousSavedTimestamp(savedTimestamp);
    setSavedTimestamp(timestamp);
    setEditMode(true);
  };

  const onUndoChangedTimestamp = () => {
    const differentJson = { exif_timestamp: savedTimestamp === null ? null : savedTimestamp.toISOString() };
    dispatch(editPhoto(photoDetail.image_hash, differentJson));
    setTimestamp(savedTimestamp);
  };

  return (
    <Group>
      {/* To-Do: Handle click on calender */}
      {editMode && (
        <Stack>
          <Group>
            <Calendar />
            <Text>Edit date and time</Text>
          </Group>
          <Stack>
            <DatePicker locale={LOCALE} value={timestamp} onChange={onChangeDate} />

            <TimeInput
              withSeconds
              value={timestamp?.toString()}
              onChange={event => onChangeTime(new Date(event.target.value))}
            />
            <Group justify="center">
              <Tooltip label="Cancel">
                <ActionIcon variant="light" onClick={onCancelDateTime} color="red">
                  <X />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Submit">
                <ActionIcon variant="light" color="green" onClick={onSaveDateTime}>
                  <Check />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>
        </Stack>
      )}
      {!editMode && (
        <Group>
          <Calendar />
          <Button
            color="dark"
            variant="subtle"
            onClick={() => {
              onActivateEditMode();
            }}
            rightSection={<Edit size={17} />}
          >
            {getDateTimeLabel()}
          </Button>
          {savedTimestamp !== timestamp && (
            <Tooltip label="Undo timestamp modification">
              <ActionIcon onClick={onUndoChangedTimestamp} color="dark">
                <ArrowBackUp size={17} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      )}
      {
        // To-Do: Show timezone of image
      }
    </Group>
  );
}
