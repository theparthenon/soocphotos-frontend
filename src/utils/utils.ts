import _ from 'lodash';
import { DateTime } from 'luxon';

import {
  DatePhotosGroup,
  IncompleteDatePhotosGroup,
  PigPhoto,
  UserPhotosGroup,
} from '@/@types/photos';
import { LOCALE } from '@/constants/api.constant';
import { DirTree } from '@/@types/dir-tree';

export const EMAIL_REGEX =
  /^\w+([-.]?\w+){0,2}(\+?\w+([-.]?\w+){0,2})?@(\w+-?\w+\.){1,9}[a-z]{2,}$/;

export const copyToClipboard = (str: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str);
  } else {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

// TODO: Add ordinal suffix to day of month when implemented in luxon (NB, is it still valid?)
export function formatDateForPhotoGroups(photoGroups: DatePhotosGroup[]): DatePhotosGroup[] {
  return photoGroups.map((photoGroup) => {
    if (photoGroup.date === null) {
      return { ...photoGroup, date: 'Without Timestamp' };
    }
    const date = DateTime.fromISO(photoGroup.date);
    if (date.isValid) {
      return {
        ...photoGroup,
        year: date.year,
        month: date.month,
        date: date.setLocale(LOCALE).toLocaleString(DateTime.DATE_HUGE),
      };
    }
    return photoGroup;
  });
}

export function getPhotosFlatFromSingleGroup(group: DatePhotosGroup) {
  return group.items;
}

export function getPhotosFlatFromGroupedByDate(photosGroupedByDate: DatePhotosGroup[]) {
  return photosGroupedByDate.flatMap(getPhotosFlatFromSingleGroup);
}

export function addTempElementsToGroups(photosGroupedByDate: IncompleteDatePhotosGroup[]) {
  photosGroupedByDate.forEach((group) => {
    for (let i = 0; i < group.numberOfItems; i++) {
      group.items.push({
        id: i.toString(),
        isTemp: true,
      } as PigPhoto);
    }
  });
}

export function addTempElementsToFlatList(photosCount: number) {
  const newPhotosFlat: PigPhoto[] = [];
  for (let i = 0; i < photosCount; i++) {
    newPhotosFlat.push({
      id: i.toString(),
      isTemp: true,
    } as PigPhoto);
  }
  return newPhotosFlat;
}

export function getPhotosFlatFromGroupedByUser(photosGroupedByUser: UserPhotosGroup[]) {
  return photosGroupedByUser.flatMap((el) => el.photos);
}

export function fuzzyMatch(query: string, value: string): boolean {
  if (query.split('').length > 0) {
    const expression = query
      .toLowerCase()
      .replace(/\s/g, '')
      .split('')
      .map((a) => _.escapeRegExp(a))
      .reduce((a, b) => `${a}.*${b}`)
      .concat('.*');
    return new RegExp(expression).test(value.toLowerCase());
  }
  return true;
}

export function mergeDirTree(tree: DirTree[], branch: DirTree): DirTree[] {
  return tree.map((folder) => {
    if (branch.absolute_path === folder.absolute_path) {
      return { ...folder, children: branch.children };
    }
    if (branch.absolute_path.startsWith(folder.absolute_path)) {
      const newTreeData = mergeDirTree(folder.children, branch);
      return { ...folder, children: newTreeData };
    }
    return folder;
  });
}

export type PartialPhotoWithLocation = {
  exif_gps_lat: number | null;
  exif_gps_lon: number | null;
  [key: string]: any;
};

export function getAveragedCoordinates(photos: PartialPhotoWithLocation[]) {
  const { lat, lon } = photos.reduce(
    (acc, photo) => {
      acc.lat += parseFloat(`${photo.exif_gps_lat}`);
      acc.lon += parseFloat(`${photo.exif_gps_lon}`);
      return acc;
    },
    { lat: 0, lon: 0 }
  );
  return { avgLat: lat / photos.length, avgLon: lon / photos.length };
}
