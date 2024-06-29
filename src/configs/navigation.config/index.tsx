import type {NavigationTree} from '@/@types/navigation';
import {
  IconAlbum as Album,
  IconBookmark as Bookmark,
  IconChartBar as ChartBar,
  IconChartLine as ChartLine,
  IconCloud as Cloud,
  IconFaceId as FaceId,
  IconMap as Map,
  IconMoodSmile as MoodSmile,
  IconPhoto as Photo,
  IconSeeding as Seeding,
  IconTags as Tags,
  IconTrash as Trash,
  IconUsers as Users,
  IconWand as Wand,
} from '@tabler/icons-react';

const navigationConfig: NavigationTree[] = [
  {
    key: 'photos',
    path: '/photos',
    title: 'Photos',
    icon: Photo,
    color: 'red',
  },
  {
    key: 'albums',
    path: '/albums/people',
    title: 'Albums',
    icon: Album,
    color: 'orange',
    type: 'collapse',
    subMenu: [
      {
        key: 'album-title',
        title: 'Albums',
        type: 'title',
      },
      {
        key: 'album-people',
        path: '/albums/people',
        title: 'People',
        icon: Users,
        color: 'gray',
        type: 'item',
      },
      {
        key: 'album-places',
        path: '/albums/places',
        title: 'Places',
        icon: Map,
        color: 'gray',
        type: 'item',
      },
      {
        key: 'album-things',
        path: '/albums/things',
        title: 'Things',
        icon: Tags,
        color: 'gray',
        type: 'item',
      },
      {
        key: 'album-divider',
        type: 'divider',
      },
      {
        key: 'album-user',
        path: '/albums/user',
        title: 'My Albums',
        icon: Bookmark,
        color: 'gray',
        type: 'item',
      },
      {
        key: 'album-auto',
        path: '/albums/auto',
        title: 'Auto-Created Albums',
        icon: Wand,
        color: 'gray',
        type: 'item',
      }
    ]
  },
  {
    key: 'data',
    path: '/data/face-clusters',
    title: 'Data',
    icon: ChartLine,
    color: 'yellow',
    subMenu: [
      {
        key: 'data-title',
        title: 'Data Vizualization',
        type: 'title',
      },
      {
        key: 'data-faces',
        path: '/data/face-scatter',
        title: 'Face Clusters',
        icon: MoodSmile,
        color: 'gray',
        type: 'item',
      },
      {
        key: 'data-family-tree',
        path: '/data/family-tree',
        title: 'Family Tree',
        icon: Seeding,
        color: 'gray',
        type: 'item',
      },
      {
        key: 'data-timeline',
        path: '/data/timeline',
        title: 'Timeline',
        icon: ChartBar,
        color: 'gray',
        type: 'item',
      },
      {
        key: 'data-word-cloud',
        path: '/data/word-cloud',
        title: 'Word Cloud',
        icon: Cloud,
        color: 'gray',
        type: 'item',
      },
    ]
  },
  {
    key: 'faces',
    path: '/faces',
    title: 'Faces',
    icon: FaceId,
    color: 'green',
    type: 'item',
  },
  {
    key: 'trash',
    path: '/trash',
    title: 'Trash',
    icon: Trash,
    color: 'blue',
    type: 'item',
  },
];

export default navigationConfig;
