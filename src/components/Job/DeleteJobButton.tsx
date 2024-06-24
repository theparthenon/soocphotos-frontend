import { Button } from "@mantine/core";
import React from "react";

import type { Job } from "@/@types/job";
import { useDeleteJobMutation } from "@/api/endpoints/adminJobs";

export function DeleteJobButton({ job }: Readonly<{ job: Job }>) {
  const [deleteJob] = useDeleteJobMutation();

  return (
    <Button onClick={() => deleteJob(job.id)} color="red" variant="outline" size="xs">
      Remove
    </Button>
  );
}
