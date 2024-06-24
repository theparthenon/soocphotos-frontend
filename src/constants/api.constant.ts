export const TOKEN_TYPE = "Bearer ";
export const REQUEST_HEADER_AUTH_KEY = "Authorization";
export const API_URL = "/api/";
export const DEFAULT_ACTION = { type: "DEFAULT_ACTION" };
export const LOCALE = "en-US";

export enum EndpointUrls {
  // Albums - Auto
  albumsAuto = "/albums/auto/",
  albumsAutoList = "/albums/auto/list/",
  // Albums - Date
  albumsDate = "/albums/date/",
  albumsDateList = "/albums/date/list/",
  // Albums - People
  albumsPeople = "/albums/people/",
  // Albums - Place
  albumsPlace = "/albums/place/",
  albumsPlaceList = "/albums/place/list/",
  // Albums - Thing
  albumsThing = "/albums/thing/",
  albumsThingList = "/albums/thing/list/",
  // Albums - User
  albumsUser = "/albums/user/",
  albumsUserEdit = "/albums/user/edit/",
  albumsUserList = "/albums/user/list/",
  // Auth
  authObtain = "/auth/token/obtain/",
  authRefresh = "/auth/token/refresh/",
  // Faces
  faces = "/faces/",
  facesIncomplete = "/faces/incomplete/",
  // Jobs
  jobs = "/jobs/",
  // Media
  media = "/media/",
  // People
  people = "/people/",
  // Photos
  photos = "/photos/",
  photosEdit = "/photos/edit/",
  photosExists = "/photos/exists/",
  photosNoTimestamp = "/photos/without-timestamp/",
  photosRecentlyAdded = "/photos/recently-added/",
  photosSearch = "/photos/search/",
  // Services
  services = "/services/",
  // Site Settings
  djangoAdmin = "/django-admin/",
  siteSettings = "/site-settings/",
  // Stats
  stats = "/stats/",
  statsServer = "/stats/server/",
  statsStorage = "/stats/storage/",
  // Tasks
  tasksAutoAlbumDeleteAll = "/tasks/auto-album/delete-all/",
  tasksAutoAlbumGenerate = "/tasks/auto-album/generate/",
  tasksAutoAlbumGenerateTitle = "/tasks/auto-album/generate/title/",
  tasksDownload = "/tasks/download/",
  tasksFacesCluster = "/tasks/faces/cluster/",
  tasksFacesDelete = "/tasks/faces/delete/",
  tasksFacesLabel = "/tasks/faces/label/",
  tasksFacesScan = "/tasks/faces/scan/",
  tasksFacesTrain = "/tasks/faces/train/",
  tasksLocationTimeline = "/tasks/location/timeline/",
  tasksPhotosDeleteMissing = "/tasks/photos/delete-missing/",
  tasksPhotosDownload = "/tasks/photos/download/",
  tasksPhotosMonthCounts = "/tasks/photos/month-counts/",
  tasksPhotosScan = "/tasks/photos/scan/",
  tasksPhotosFullScan = "/tasks/photos/full-scan/",
  tasksPhotosScanUploaded = "/tasks/photos/scan-uploaded/",
  tasksPhotosEditDelete = "/tasks/photos-edit/delete/",
  tasksPhotosEditDuplicateDelete = "/tasks/photos-edit/duplicate/delete/",
  tasksPhotosEditFavorite = "/tasks/photos-edit/favorite/",
  tasksPhotosEditHide = "/tasks/photos-edit/hide/",
  tasksPhotosEditCaptionGenerate = "/tasks/photos-edit/caption/generate/",
  tasksPhotosEditCaptionSave = "/tasks/photos-edit/caption/save/",
  tasksPhotosEditSetDeleted = "/tasks/photos-edit/set-deleted/",
  tasksQueueAvailability = "/tasks/queue-availability/",
  tasksRulesDefault = "/tasks/rules/default/",
  tasksRulesPredefined = "/tasks/rules/predefined/",
  tasksSearchExampleTerms = "/tasks/search/example-terms/",
  tasksUpload = "/tasks/upload/",
  tasksUploadComplete = "/tasks/upload/complete/",
  tasksZipDelete = "/tasks/zip/delete/",
  // Timezones
  timezones = "/timezones/",
  // User
  user = "/user/",
  userManage = "/user/manage/",
  userDelete = "/user/delete/",
  // Visual
  visualDirTree = "/visual/dir-tree/",
  visualImageTag = "/visual/image-tag/",
  visualLocationClusters = "/visual/location/clusters/",
  visualLocationSunburst = "/visual/location/sunburst/",
  visualSocialGraph = "/visual/social-graph/",
  visualWordCloud = "/visual/word-cloud/",
}

export enum Endpoints {
  // Albums - Auto
  fetchAutoAlbums = "fetchAutoAlbums",
  fetchAutoAlbum = "fetchAutoAlbum",
  deleteAutoAlbum = "deleteAutoAlbum",
  deleteAllAutoAlbums = "deleteAllAutoAlbums",
  generateAutoAlbums = "generateAutoAlbums",
  // Albums - Date
  fetchDateAlbums = "fetchDateAlbums",
  fetchDateAlbum = "fetchDateAlbum",
  // Albums - People
  fetchPeopleAlbums = "fetchPeopleAlbums",
  renamePersonAlbum = "renamePersonAlbum",
  deletePersonAlbum = "deletePersonAlbum",
  setPersonAlbumCover = "setPersonAlbumCover",
  // Albums - Places
  fetchPlacesAlbums = "fetchPlacesAlbums",
  fetchPlaceAlbum = "fetchPlaceAlbum",
  fetchLocationClusters = "fetchLocationClusters",
  // Albums - Things
  fetchThingsAlbums = "fetchThingsAlbums",
  fetchThingsAlbum = "fetchThingsAlbum",
  // Albums - User
  fetchUserAlbums = "fetchUserAlbums",
  fetchUserAlbum = "fetchUserAlbum",
  createUserAlbum = "createUserAlbum",
  renameUserAlbum = "renameUserAlbum",
  deleteUserAlbum = "deleteUserAlbum",
  removePhotoFromUserAlbum = "removePhotoFromUserAlbum",
  addPhotoToUserAlbum = "addPhotoToUserAlbum",
  setUserAlbumCover = "setUserAlbumCover",
  // Auth
  login = "login",
  // Faces
  incompleteFaces = "fetchIncompleteFaces",
  fetchFaces = "fetchFaces",
  clusterFaces = "clusterFaces",
  rescanFaces = "rescanFaces",
  trainFaces = "trainFaces",
  deleteFaces = "deleteFaces",
  setFacesPersonLabel = "setFacesPersonLabel",
  // Jobs
  jobs = "jobs",
  deleteJob = "deleteJob",
  worker = "worker",
  // Photos
  fetchPhotoDetails = "fetchPhotoDetails",
  updatePhoto = "updatePhoto",
  savePhotoCaption = "savePhotoCaption",
  generateImageToTextCaption = "generateImageToTextCaption",
  setPhotosDeleted = "setPhotosDeleted",
  fetchPhotosWithoutTimestamp = "fetchPhotosWithoutTimestamp",
  markPhotosDeleted = "markPhotosDeleted",
  purgeDeletedPhotos = "purgeDeletedPhotos",
  deleteDuplicatePhoto = "deleteDuplicatePhoto",
  deleteMissingPhotos = "deleteMissingPhotos",
  downloadPhotos = "downloadPhotos",
  fetchRecentlyAddedPhotos = "fetchRecentlyAddedPhotos",
  scanPhotos = "scanPhotos",
  rescanPhotos = "rescanPhotos",
  setPhotosHidden = "setPhotosHidden",
  setFavoritePhotos = "setFavoritePhotos",
  // Search
  searchExamples = "searchExamples",
  searchPhotos = "searchPhotos",
  // Settings
  getSettings = "getSettings",
  updateSettings = "updateSettings",
  // User
  deleteUser = "deleteUser",
  fetchUserList = "fetchUserList",
  fetchUserSelfDetails = "fetchUserSelfDetails",
  manageUpdateUser = "manageUpdateUser",
  updateAvatar = "updateAvatar",
  updateUser = "updateUser",
  // Stats
  fetchServerStats = "fetchServerStats",
  fetchStorageStats = "fetchStorageStats",
  // Tasks
  fetchCountStats = "fetchCountStats",
  fetchLocationTree = "fetchLocationTree",
  fetchPhotoMonthCount = "fetchPhotoMonthCount",
  fetchPredefinedRules = "fetchPredefinedRules",
  fetchTimezones = "fetchTimezones",
  fetchWordCloud = "fetchWordCloud",
  generateAutoAlbumTitle = "generateAutoAlbumTitle",
  upload = "upload",
  uploadExists = "uploadExists",
  uploadFinished = "uploadFinished",
  // Visual
  fetchDirs = "fetchDirs",
  fetchImageTag = "fetchImageTag",
  locationTimeline = "locationTimeline",
}
