/* eslint-disable jsx-a11y/control-has-associated-label */
import { Alert, Card, Flex, Loader, Pagination, Table, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAlertCircle as AlertCircle } from "@tabler/icons-react";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

import { JobsResponseSchema } from "@/@types/job";
import { useJobsQuery } from "@/api/endpoints/adminJobs";
import { DeleteJobButton } from "./DeleteJobButton";
import { JobDuration } from "./JobDuration";
import { JobIndicator } from "./JobIndicator";
import { JobProgress } from "./JobProgress";
import { LOCALE } from "@/constants/api.constant";

export function JobList() {
  const matches = useMediaQuery("(min-width: 700px)");
  const [jobCount, setJobCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [pageSize] = useState(10);

  const { data: jobs, isLoading } = useJobsQuery({ page: activePage, pageSize }, { pollingInterval: 2000 });

  useEffect(() => {
    if (!jobs) {
      return;
    }
    try {
      const data = JobsResponseSchema.parse(jobs);
      if (data) {
        setJobCount(data.count);
      }
    } catch (error) {
      console.error('Error parsing jobs data:', error);
    }
  }, [jobs]);

  return (
    <Card shadow="md">
      <Title order={3} mb={20}>
        Worker Logs {isLoading ? <Loader size="xs" /> : null}
      </Title>
      <Alert icon={<AlertCircle />} title="Removing entries" mb={20}>
      Removing an entry does not actually stop the job - it's only removed from the DB. Use only in cases when you know that a job failed ungracefully, by inspecting the logs, etc.
      </Alert>
      <Table striped highlightOnHover verticalSpacing="xs">
        <thead>
          <tr>
            <th>Status</th>
            <th>Job Type</th>
            <th>Progress</th>
            {matches && (
              <>
                <th>Queued</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Started By</th>
              </>
            )}
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {jobs?.results.map(job => (
            <tr key={job.job_id}>
              <td>
                <JobIndicator job={Object.create(job)} />
              </td>
              <td>{job.job_type_str}</td>
              <td>
                <JobProgress
                  target={job.result.progress.target}
                  current={job.result.progress.current}
                  error={job.error}
                  finished={job.finished}
                />
              </td>
              {matches && (
                <>
                  <td>{DateTime.fromISO(job.queued_at).setLocale(LOCALE).toRelative()}</td>
                  <td>
                    {job.started_at
                      ? DateTime.fromISO(job.started_at!).setLocale(LOCALE).toRelative()
                      : ""}
                  </td>
                </>
              )}

              <JobDuration
                matches={matches}
                finished={job.finished}
                finishedAt={job.finished_at}
                startedAt={job.started_at}
              />
              {matches && <td>{job.started_by.username}</td>}
              <td>
                <DeleteJobButton job={job} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Flex justify="center" mt={20}>
        <Pagination
          total={Math.ceil(+jobCount.toFixed(1) / pageSize)}
          onChange={newPage => setActivePage(newPage)}
          withEdges
        />
      </Flex>
    </Card>
  );
}
