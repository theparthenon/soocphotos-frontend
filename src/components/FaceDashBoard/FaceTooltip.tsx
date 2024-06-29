import { Tooltip } from "@mantine/core";
import { DateTime } from "luxon";
import React from "react";

import { useAppSelector } from "@/store/store";
import { LOCALE } from "@/constants/api.constant";

type Props = Readonly<{
  tooltipOpened: boolean;
  cell: any;
  children?: React.ReactNode;
}>;

export function FaceTooltip(
  {
    tooltipOpened,
    cell,
    children = null
  }: Props) {
  const { activeTab } = useAppSelector(store => store.faces);

  const confidencePercentageLabel =
    activeTab === "inferred"
      ? "Confidence: " + (cell.person_label_probability * 100).toFixed(1) + "%"
      : null;

  const dateTimeLabel = DateTime.fromISO(cell.timestamp).isValid
    ? DateTime.fromISO(cell.timestamp).setLocale(LOCALE).toLocaleString(DateTime.DATETIME_MED)
    : null;

  const tooltipIsEmpty = confidencePercentageLabel === null && dateTimeLabel === null;
  const tooltipLabel = () => {
    if (tooltipIsEmpty) {
      return null;
    }
    return (
      <div>
        {confidencePercentageLabel}
        <div>{dateTimeLabel}</div>
      </div>
    );
  };

  return (
    <Tooltip opened={tooltipOpened && !tooltipIsEmpty} label={tooltipLabel()} position="bottom" withArrow>
      {children}
    </Tooltip>
  );
}
