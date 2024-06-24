import { DateTime } from "luxon";
import React from "react";

type IJobDuration = Readonly<{
  matches: boolean;
  finished: boolean;
  finishedAt: string | null;
  startedAt: string | null;
}>;

export function JobDuration({ matches, finished, finishedAt, startedAt }: IJobDuration): JSX.Element | null {

  if (matches) {
    if (finished && finishedAt && startedAt) {
      return (
        <td>
          {DateTime.fromISO(finishedAt)
            .diff(DateTime.fromISO(startedAt))
            .reconfigure({ locale: "en" })
            .rescale()
            .toHuman()}
        </td>
      );
    }
    if (startedAt) {
      return <td>running</td>;
    }
  }

  return <td>waiting</td>;
}
