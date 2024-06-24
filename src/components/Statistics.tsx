import { Card, Flex, Grid, Group, HoverCard, Stack, Text, Title } from "@mantine/core";
import {
  IconCalendar as Calendar,
  IconFaceId as FaceId,
  IconPhoto as Photo,
  IconQuestionMark as QuestionMark,
  IconSettingsAutomation as SettingsAutomation,
  IconTag as Tag,
  IconUsers as Users,
} from "@tabler/icons-react";
import React from "react";

import { COUNT_STATS_DEFAULTS } from "@/@types/utils";
import { useFetchCountStatsQuery } from "@/api/endpoints/utils";

export function CountStats() {
  const { data: countStats = COUNT_STATS_DEFAULTS } = useFetchCountStatsQuery();

  return (
    <Group grow gap="xs" align="stretch">
      <Card withBorder p="xs">
        <Group justify="left" gap="xs">
          <Photo size={64} strokeWidth={1} />
          <div>
            <Text color="dimmed">Photos</Text>
            <Title order={3}>{countStats.num_photos}</Title>
          </div>
        </Group>
      </Card>

      <Card withBorder p="xs">
        <Group justify="left" gap="xs">
          <Users size={64} strokeWidth={1} />
          <div>
            <Text color="dimmed">People</Text>
            <Title order={3}>{countStats.num_people}</Title>
          </div>
        </Group>
      </Card>

      <Card withBorder p="xs">
        <HoverCard width={300} shadow="md" withinPortal withArrow>
          <HoverCard.Target>
            <Group justify="left" gap="xs">
              <FaceId size={64} strokeWidth={1} />
              <div>
                <Text color="dimmed">Faces</Text>
                <Title order={3}>{countStats.num_faces}</Title>
              </div>
            </Group>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Grid>
              <Grid.Col span={9}>
                <Stack gap={0}>
                  <Text>
                    Inferred
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Flex gap="sm">
                  <FaceId />
                  {countStats.num_inferred_faces}
                </Flex>
              </Grid.Col>
              <Grid.Col span={9}>
                <Stack gap={0}>
                  <Text>
                    Labeled
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Flex gap="sm">
                  <Tag />
                  {countStats.num_labeled_faces}
                </Flex>
              </Grid.Col>
              <Grid.Col span={9}>
                <Stack gap={0}>
                  <Text>
                    Unknown
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Flex gap="sm">
                  <QuestionMark />
                  {countStats.num_unknown_faces}
                </Flex>
              </Grid.Col>
            </Grid>
          </HoverCard.Dropdown>
        </HoverCard>
      </Card>

      <Card withBorder p="xs">
        <Group justify="left" gap="xs">
          <SettingsAutomation size={64} strokeWidth={1} />
          <div>
            <Text color="dimmed">Events</Text>
            <Title order={3}>{countStats.num_albumauto}</Title>
          </div>
        </Group>
      </Card>

      <Card withBorder p="xs">
        <Group justify="left" gap="xs">
          <Calendar size={64} strokeWidth={1} />
          <div>
            <Text color="dimmed">Days</Text>
            <Title order={3}>{countStats.num_albumdate}</Title>
          </div>
        </Group>
      </Card>
    </Group>
  );
}
