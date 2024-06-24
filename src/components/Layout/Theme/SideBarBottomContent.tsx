import { useFetchStorageStatsQuery } from '@/api/api';
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
        label={ storageStats.used_storage + " of " + storageStats.total_storage + " used" }
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
