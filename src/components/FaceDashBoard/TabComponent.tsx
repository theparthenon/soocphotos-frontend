import { Group, Loader, Tabs } from "@mantine/core";
import React from "react";

import { faceActions } from "@/store/face/faceSlice";
import { FacesTab } from "@/@types/faces";
import type { IFacesTab } from "@/@types/faces";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { FacesCountersHoverCard } from "./FacesCountersHoverCard";

type Props = Readonly<{
  width: number;
  fetchingLabeledFacesList: boolean;
  fetchingInferredFacesList: boolean;
}>;

export function TabComponent({ width, fetchingLabeledFacesList, fetchingInferredFacesList }: Props) {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector(store => store.face);
  const changeTab = (tab: IFacesTab) => {
    dispatch(faceActions.changeTab(tab));
  };

  return (
    <Group justify="apart">
      <Tabs defaultValue={activeTab} style={{ width }} onChange={changeTab}>
        <Tabs.List>
          <FacesCountersHoverCard tab={FacesTab.enum.labeled}>
            <Tabs.Tab value={FacesTab.enum.labeled}>
              Labeled {fetchingLabeledFacesList ? <Loader size="sm" /> : null}
            </Tabs.Tab>
          </FacesCountersHoverCard>
          <FacesCountersHoverCard tab={FacesTab.enum.inferred}>
            <Tabs.Tab value={FacesTab.enum.inferred}>
              Inferred {fetchingInferredFacesList ? <Loader size="sm" /> : null}
            </Tabs.Tab>
          </FacesCountersHoverCard>
        </Tabs.List>
      </Tabs>
    </Group>
  );
}
