import { HoverCard, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

import { FacesTab } from "@/@types/faces";
import type { IFacesTab } from "@/@types/faces";
import { useAppSelector } from "@/store/store";

type Props = Readonly<{
  tab: IFacesTab;
  children: React.ReactNode;
}>;

export function FacesCountersHoverCard({ tab, children }: Props) {
  const { inferredFacesList, labeledFacesList } = useAppSelector(store => store.faces);

  const [labeledPersonsCount, setLabeledPersonsCount] = useState(0);
  const [labeledFacesCount, setLabeledFacesCount] = useState(0);
  const [labeledUnknownFacesCount, setLabeledUnknownFacesCount] = useState(0);
  const [inferredAssumedPersonsCount, setInferredAssumedPersonsCount] = useState(0);
  const [inferredAssumedFacesCount, setInferredAssumedFacesCount] = useState(0);
  const [inferredClustersCount, setInferredClustersCount] = useState(0);
  const [inferredClusteredFacesCount, setInferredClusteredFacesCount] = useState(0);
  const [inferredUnknownFacesCount, setInferredUnknownFacesCount] = useState(0);

  useEffect(() => {
    const labeledFacesListWithoutUnknown = labeledFacesList.filter(g => g.kind !== "UNKNOWN");
    setLabeledPersonsCount(labeledFacesListWithoutUnknown.length);
    setLabeledFacesCount(labeledFacesListWithoutUnknown.map(g => g.face_count).reduce((a, b) => a + b, 0));
    setLabeledUnknownFacesCount(
      labeledFacesList.map(g => (g.kind === "UNKNOWN" ? g.face_count : 0)).reduce((a, b) => a + b, 0)
    );
  }, [labeledFacesList]);

  useEffect(() => {
    const assumedFacesList = inferredFacesList.filter(g => g.kind === "USER");
    setInferredAssumedPersonsCount(assumedFacesList.length);
    setInferredAssumedFacesCount(assumedFacesList.map(g => g.face_count).reduce((a, b) => a + b, 0));
    const clusteredFacesList = inferredFacesList.filter(g => g.kind === "CLUSTER");
    setInferredClustersCount(clusteredFacesList.length);
    setInferredClusteredFacesCount(clusteredFacesList.map(g => g.face_count).reduce((a, b) => a + b, 0));
    setInferredUnknownFacesCount(
      inferredFacesList.map(g => (g.kind === "UNKNOWN" ? g.face_count : 0)).reduce((a, b) => a + b, 0)
    );
  }, [inferredFacesList]);

  const getLabeledCounters = () => (
    <Stack>
      <Text size="sm">
        {labeledPersonsCount == 1 ? "1 Person" : labeledPersonsCount + " People"} {" "}
        ({labeledFacesCount} Faces)
      </Text>
      {labeledUnknownFacesCount !== 0 && (
        <Text size="sm">{labeledUnknownFacesCount} Unknown Faces</Text>
      )}
    </Stack>
  );

  const getInferredCounters = () => (
    <Stack>
      <Text size="sm">
        {inferredAssumedPersonsCount == 1 ? "1 Inferred Person" : inferredAssumedPersonsCount + " Inferred People"}{" "}
        ({inferredAssumedFacesCount} Faces)
      </Text>
      <Text size="sm">
        {inferredClustersCount} Clusters{" "}
        ({inferredClusteredFacesCount} Faces)
      </Text>
      {inferredUnknownFacesCount !== 0 && (
        <Text size="sm">{inferredUnknownFacesCount} Unknown Faces</Text>
      )}
    </Stack>
  );

  const getCountersContent = () => {
    if (tab === FacesTab.enum.labeled) return getLabeledCounters();
    if (tab === FacesTab.enum.inferred) return getInferredCounters();
    return null;
  };

  return (
    <HoverCard shadow="md" openDelay={500}>
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown>{getCountersContent()}</HoverCard.Dropdown>
    </HoverCard>
  );
}
