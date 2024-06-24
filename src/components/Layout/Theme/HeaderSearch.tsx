import { Autocomplete, Avatar, Group, Text } from "@mantine/core";
import { useInterval, useViewportSize } from "@mantine/hooks";
import {
    IconAlbum as Album,
    IconMap as Map,
    IconSearch as Searching,
    IconTag as Tag,
    IconX as X,
} from "@tabler/icons-react";
import { random } from "lodash";
import React, { cloneElement, forwardRef, useCallback, useEffect, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { push } from "redux-first-history";

import { useFetchPeopleAlbumsQuery } from "@/api/endpoints/albums/people";
import { useFetchPlacesAlbumsQuery } from "@/api/endpoints/albums/places";
import { useFetchThingsAlbumsQuery } from "@/api/endpoints/albums/things";
import { useFetchUserAlbumsQuery } from "@/api/endpoints/albums/user";
import { useSearchExamplesQuery } from "@/api/endpoints/search";
import { useAppDispatch } from "@/store/store";
import { fuzzyMatch } from "@/utils/utils";

enum SuggestionType {
    EXAMPLE,
    PEOPLE,
    PLACE_ALBUM,
    THING_ALBUM,
    USER_ALBUM,
}

interface SearchSuggestion {
    value: string;
    icon: ReactNode;
    [key: string]: any;
}

interface AutocompleteItem {
    value: string;
    [key: string]: any;
}

function toExampleSuggestion(item: string) {
    return { value: item, type: SuggestionType.EXAMPLE };
}

function toPeopleSuggestion(item: any) {
    return {
      value: item.value,
      icon: <Avatar src={item.face_url} alt={item.value} size="xl" />,
      type: SuggestionType.PEOPLE,
      id: item.key,
    };
}

function toPlaceSuggestion(item: any) {
    return { value: item.title, icon: <Map />, type: SuggestionType.PLACE_ALBUM, id: item.id };
}

function toThingSuggestion(item: any) {
    return { value: item.title, icon: <Tag />, type: SuggestionType.THING_ALBUM, id: item.id };
}

function toUserAlbumSuggestion(item: any) {
    return { value: item.title, icon: <Album />, type: SuggestionType.USER_ALBUM, id: item.id };
}


const SearchSuggestionItem = forwardRef<HTMLDivElement, SearchSuggestion>(
    ({ icon = <Search />, value, ...rest }: SearchSuggestion, ref) => (
      /* eslint-disable react/jsx-props-no-spreading */
      <div ref={ref} {...rest}>
        <Group>
          {cloneElement(icon as React.ReactElement, { size: 20 })}
          <Text>{value}</Text>
        </Group>
      </div>
    )
);

export default function Search() {
    const { width } = useViewportSize();
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState<Array<AutocompleteItem>>([]);

    const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const searchBarWidth = width - width / 2.2;
  const { data: searchExamples } = useSearchExamplesQuery();
  const { data: placeAlbums } = useFetchPlacesAlbumsQuery();
  const { data: thingAlbums } = useFetchThingsAlbumsQuery();
  const { data: userAlbums } = useFetchUserAlbumsQuery();
  const { data: people } = useFetchPeopleAlbumsQuery();

  const updateSearchPlaceholder = useInterval(() => {
    if (!searchExamples) {
      return;
    }
    const example = searchExamples[Math.floor(random(0.1, 1) * searchExamples.length)];
    setSearchPlaceholder(`Search ${example}`);
  }, 5000);

  const filterSearch = useCallback(
    (query: string = "") => {
      if (!searchExamples || !placeAlbums || !thingAlbums || !userAlbums || !people) {
        return;
      }
      setValue(query);
      setSearchSuggestions([
        ...searchExamples
          .filter((item: string) => fuzzyMatch(query, item))
          .slice(0, 2)
          .map(toExampleSuggestion),
        ...placeAlbums
          .filter((item: any) => fuzzyMatch(query, item.title))
          .slice(0, 2)
          .map(toPlaceSuggestion),
        ...thingAlbums
          .filter((item: any) => fuzzyMatch(query, item.title))
          .slice(0, 2)
          .map(toThingSuggestion),
        ...userAlbums
          .filter((item: any) => fuzzyMatch(query, item.title))
          .slice(0, 2)
          .map(toUserAlbumSuggestion),
        ...people
          .filter((item: any) => fuzzyMatch(query, item.value))
          .slice(0, 2)
          .map(toPeopleSuggestion),
      ]);
    },
    [placeAlbums, searchExamples, thingAlbums, userAlbums, people]
  );

  function createSearch(item: AutocompleteItem) {
    switch (item.type) {
      case undefined:
      case SuggestionType.EXAMPLE:
        dispatch(push(`/search/${item.value}`));
        break;
      case SuggestionType.USER_ALBUM:
        dispatch(push(`/albums/user/${item.id}`));
        break;
      case SuggestionType.PLACE_ALBUM:
        dispatch(push(`/albums/place/${item.id}`));
        break;
      case SuggestionType.THING_ALBUM:
        dispatch(push(`/albums/thing/${item.id}`));
        break;
      case SuggestionType.PEOPLE:
        dispatch(push(`/person/${item.id}`));
        break;
      default:
        break;
    }
  }

  function onKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.code === "Enter") {
      createSearch({ value: event.currentTarget.value, icon: undefined });
    }
  }

  useEffect(() => {
    filterSearch();
  }, [searchExamples, placeAlbums, thingAlbums, userAlbums, people, filterSearch]);

  useEffect(() => {
    updateSearchPlaceholder.start();
    return updateSearchPlaceholder.stop;
  }, [updateSearchPlaceholder]);

    return (
        <Autocomplete
            width={searchBarWidth}
            data={searchSuggestions}
            leftSection={<Searching size={14} className="searchIcon" />}
            placeholder={searchPlaceholder}
            renderOption={SearchSuggestionItem}
            limit={10}
            value={value}
            onChange={e => filterSearch(e)}
            onOptionSubmit={e => createSearch(e)}
            onKeyUp={e => onKeyUp(e)}
            rightSection={
                value ? (
                <X
                    className="searchClear"
                    size={13}
                    onClick={() => {
                    setValue("");
                    filterSearch();
                    }}
                />
                ) : null
            }
            />
    );
}