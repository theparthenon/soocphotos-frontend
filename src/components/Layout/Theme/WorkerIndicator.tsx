import { Indicator, Popover, Progress, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

import type { IJobDetailSchema } from "@/@types/job";
import { useWorkerStatus } from "@/hooks/useWorkerStatus";

type IWorkerIndicator = Readonly<{
    workerRunningJob: IJobDetailSchema;
}>;

function WorkerRunningJob({ workerRunningJob }: IWorkerIndicator) {
    if (!workerRunningJob ||
        !workerRunningJob.result ||
        !workerRunningJob.result.progress) {
        return <span>Busy</span>;
    }

    const progress = workerRunningJob.result.progress;
    const value = (+progress.current.toFixed(2) / progress.target) * 100;

    return (
        <Stack>
            <Progress value={value} />
            <Text size="sm" style={{ textAlign: "center" }} component="div">
                {progress.current} / {progress.target}
            </Text>
            <Text size="sm" style={{ textAlign: "center" }} component="div">
                Running {workerRunningJob.job_type_str} ...
            </Text>
        </Stack>
    );
}

export function WorkerIndicator() {
    const [opened, { open, close }] = useDisclosure(false);
    const [workerColor, setWorkerColor] = useState("red");
    const { workerRunningJob, currentData } = useWorkerStatus();

    useEffect(() => {
        if (currentData) {
            setWorkerColor(currentData.queue_can_accept_job ? "green" : "red");
        } else {
            setWorkerColor("red");
        }
    }, [currentData?.queue_can_accept_job]);

    return (
        <Popover opened={opened} width={260} position="bottom" withArrow>
            <Popover.Target>
                <Indicator onMouseEnter={open} onMouseLeave={close} color={workerColor}>
                <div />
                </Indicator>
            </Popover.Target>

            <Popover.Dropdown>
                <Text size="sm">
                {currentData?.queue_can_accept_job ? (
                    "Worker available! You can start scanning more photos, infer face labels, auto create event albums, or regenerate auto event album titles."
                ) : (
                    <WorkerRunningJob workerRunningJob={workerRunningJob} />
                )}
                </Text>
            </Popover.Dropdown>
        </Popover>
    );
}