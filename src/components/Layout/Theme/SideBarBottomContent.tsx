import { useFetchStorageStatsQuery } from '@/api/api';
import { formatBytes } from '@/utils/utils';
import { Progress, Tooltip } from '@mantine/core';

export default function SideBarBottomContent(){
  const { data: storageStats, isLoading } = useFetchStorageStatsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!storageStats) {
    return <div>No data available</div>;
  }

  return (
    <>
      <Tooltip
        label={ formatBytes(storageStats.used_storage) + " of " + formatBytes(storageStats.total_storage) + " used" }
      >
        <Progress
          style={{ margin: 10 }}
          value={(storageStats.used_storage / storageStats.total_storage) * 100}
          color="grey"
        />
      </Tooltip>
    </>
  );
}
