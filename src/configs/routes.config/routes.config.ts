import { lazy } from "react";
import authRoute from "./authRoute";
import type { Routes } from "@/@types/routes";

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes = [
  {
    key: "albums-auto",
    path: "/albums/auto",
    component: lazy(() => import("@/pages/albums/Auto")),
  },
  {
    key: "albums-people",
    path: "/albums/people",
    component: lazy(() => import("@/pages/albums/People")),
  },
  {
    key: "albums-places",
    path: "/albums/places",
    component: lazy(() => import("@/pages/albums/Places")),
  },
  {
    key: "albums-things",
    path: "/albums/things",
    component: lazy(() => import("@/pages/albums/Things")),
  },
  {
    key: "data-face-clusters",
    path: "/data/face-clusters",
    component: lazy(() => import("@/pages/data/FaceClusters")),
  },
  {
    key: "data-family-tree",
    path: "/data/family-tree",
    component: lazy(() => import("@/pages/data/FamilyTree")),
  },
  {
    key: "data-timeline",
    path: "/data/timeline",
    component: lazy(() => import("@/pages/data/Timeline")),
  },
  {
    key: "faces",
    path: "/faces",
    component: lazy(() => import("@/pages/faces/FaceDashboard")),
  },
  {
    key: "photos",
    path: "/photos",
    component: lazy(() => import("@/pages/photos/OnlyPhotos")),
  },
  {
    key: 'photos-deleted',
    path: '/photos/deleted',
    component: lazy(() => import('@/pages/photos/DeletedPhotos')),
  },
  {
    key: 'photos-favorites',
    path: '/photos/favorites',
    component: lazy(() => import('@/pages/photos/FavoritePhotos')),
  },
  {
    key: 'photos-hidden',
    path: '/photos/hidden',
    component: lazy(() => import('@/pages/photos/HiddenPhotos')),
  },
  {
    key: "photos-recently-added",
    path: "/photos/recently-added",
    component: lazy(() => import("@/pages/photos/RecentlyAddedPhotos")),
  },
  {
    key: "photos-with-timestamps",
    path: "/photos/with-timestamps",
    component: lazy(() => import("@/pages/photos/WithTimestamps")),
  },
  {
    key: "photos-without-timestamps",
    path: "/photos/without-timestamps",
    component: lazy(() => import("@/pages/photos/WithoutTimestamps")),
  },
  {
    key: "trash",
    path: "/trash",
    component: lazy(() => import("@/pages/photos/DeletedPhotos")),
  },
  {
    key: "settings",
    path: "/settings",
    component: lazy(() => import("@/pages/Settings/Settings")),
  },
  {
    key: "settings-library",
    path: "/settings/library",
    component: lazy(() => import("@/pages/Settings/Library")),
  },
  {
    key: "settings-profile",
    path: "/settings/profile",
    component: lazy(() => import("@/pages/Settings/Profile")),
  },
  {
    key: "admin",
    path: "/admin",
    component: lazy(() => import("@/pages/Settings/AdminPage")),
  },
  {
    key: "videos",
    path: "/videos",
    component: lazy(() => import("@/pages/photos/OnlyVideos")),
  },
  // {
  //   key: "visual-count-stats",
  //   path: "/visual/count-stats",
  //   component: lazy(() => import("@/components/Statistics")),
  // },
];
