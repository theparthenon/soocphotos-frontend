import { Center, Progress } from "@mantine/core";
import React from "react";

type IJobProgress = Readonly<{
  target?: number;
  current?: number;
  finished: boolean;
  error: unknown;
}>;

export function JobProgress({ target = 0, current = 0, finished, error }: IJobProgress) {

  if (target && current && target !== 0 && !finished) {
    return (
      <div>
        <Progress size={10} value={(+current.toFixed(2) / target) * 100} />
        <Center>
          {`${current} Asset(s) added (${((+current.toFixed(2) / target) * 100).toFixed(2)} %) `}
        </Center>
      </div>
    );
  }
  if (finished) {
    return (
      <div>
        <Progress size={10} color={error ? "red" : "green"} value={100} />
        <Center>{`${current} Asset(s) added `}</Center>
      </div>
    );
  }
  return (
    <div>
      <Progress size={10} color="blue" value={0} />
      <Center>waiting</Center>
    </div>
  );
}