import { Image, Loader, Stack, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { Hint, HorizontalGridLines, MarkSeries, VerticalGridLines, XYPlot } from "react-vis";

import { api } from "@/api/api";
import { serverAddress } from "@/api/apiClient";
import { useAppDispatch, useAppSelector } from "@/store/store";

type Props = Readonly<{
    height: number;
}>;

export function FaceClusterGraph({ height }: Props) {
    const [hintValue, setHintValue] = useState<any>({} as any);
    const { observe: observeChange, width } = useDimensions({
        onResize: ({ observe }) => {
            observe();
        },
    });
    const dispatch = useAppDispatch();
    const { facesVis, clustered, clustering } = useAppSelector(state => state.faces);

    useEffect(() => {
        dispatch(api.endpoints.clusterFaces.initiate());
    }, [dispatch]); // Only run on first render.

    const personNames = [...new Set(facesVis.map((el: any) => el.person_name))];

    const mappedScatter = personNames.map(name => {
        const thisPersonVis = facesVis.filter((el: any) => name === el.person_name);
        const thisPersonData = thisPersonVis.map((el: any) => ({
            x: el.value.x,
            y: el.value.y,
            size: el.value.size,
            name: el.person_name,
            color: el.color,
            face_url: el.face_url,
            photo: el.photo,
        }));

        return (
        <MarkSeries
            colorType="literal"
            key={`cluster-marker-${name}`}
            animation
            onValueClick={d => {
            setHintValue(d);
            }}
            data={thisPersonData}
        />
        );
        // @ts-ignore
    }, this);

    if (clustered) {
        return (
          <Stack ref={observeChange}>
            <div>
              <Title order={3}>Face Clusters</Title>
              <Text color="dimmed">People with similar looking faces should be grouped closer together in this plot (Click on a point to see the label).</Text>
            </div>
            <XYPlot width={width - 30} height={height}>
              <HorizontalGridLines />
              <VerticalGridLines />
              {mappedScatter}
              {hintValue.name && (
                <Hint value={hintValue}>
                  <Text>
                    {hintValue.name}
                    <Image radius="xl" height={70} width={70} src={serverAddress + hintValue.face_url} />
                  </Text>
                </Hint>
              )}
            </XYPlot>
          </Stack>
        );
    }

    if (clustering) {
        return (
          <Stack>
            <Loader />
          </Stack>
        );
    }

    return (
        <Stack>
          <div>
            <Title order={3}>Face Clusters</Title>
            <Text color="dimmed">People with similar looking faces should be grouped closer together in this plot (Click on a point to see the label).</Text>
          </div>
          <Text>No faces</Text>
        </Stack>
    );
}

export default FaceClusterGraph;
