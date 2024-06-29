import { useElementSize } from "@mantine/hooks";
import { Gallery } from "react-gallery-grid";
import { useEffect, useState } from "react";

import { FacesTab } from "@/@types/faces";
import { api, useFetchIncompleteFacesQuery } from "@/api/api";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { calculateFaceGridCellSize, calculateFaceGridCells } from "@/utils/gridUtils";

export default function Faces(){
  const { ref, width } = useElementSize();
  const { activeTab, tabs } = useAppSelector(store => store.faces);
  const fetchingInferredFacesList = useFetchIncompleteFacesQuery({ inferred: false }).isFetching;
  const fetchingLabeledFacesList = useFetchIncompleteFacesQuery({ inferred: true }).isFetching;
  const dispatch = useAppDispatch();

  const [groups, setGroups] = useState<
    {
      page: number;
      person: any;
      inferred: boolean;
    }[]
  >([]);

  const { orderBy } = useAppSelector(store => store.faces);

  useEffect(() => {
    if (groups) {
      groups.forEach(element => {
        let force = false;
        const currentList = element.inferred ? labeledFacesList : inferredFacesList;
        const personIndex = currentList.findIndex(person => person.id === element.person);
        // Force refetch for persons that have more than 100 faces as we can't be sure all faces were loaded when changing orderBy
        if (personIndex !== -1 && currentList[personIndex].face_count > 100) force = true;
        dispatch(
          api.endpoints.fetchFaces.initiate(
            {
              person: element.person,
              page: element.page,
              inferred: element.inferred,
              orderBy,
            },
            { forceRefetch: force }
          )
        );
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [activeTab, groups, orderBy]);

  const { inferredFacesList, labeledFacesList } = useAppSelector(
    store => store.faces,
    (prev, next) => prev.inferredFacesList === next.inferredFacesList && prev.labeledFacesList === next.labeledFacesList
  );

  const { entrySquareSize, numEntrySquaresPerRow } = calculateFaceGridCellSize(width);

  const inferredCellContents = calculateFaceGridCells(inferredFacesList, numEntrySquaresPerRow).cellContents;
  const labeledCellContents = calculateFaceGridCells(labeledFacesList, numEntrySquaresPerRow).cellContents;

  useEffect(() => {
    if (fetchingInferredFacesList || fetchingLabeledFacesList) {
      setGroups([]);
    }
  }, [fetchingInferredFacesList, fetchingLabeledFacesList]);


  const idx2hash =
    activeTab === FacesTab.enum.labeled
      ? labeledFacesList
          .flatMap(person => person.faces)
          .map(face => ({
            id: face.photo,
          }))
      : inferredFacesList
          .flatMap(person => person.faces)
          .map(face => ({
            id: face.photo,
          }));

    console.log(inferredFacesList)

    return(
      <>
        Hi
      </>
    )
  }
