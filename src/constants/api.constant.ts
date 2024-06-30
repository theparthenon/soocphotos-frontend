export const TOKEN_TYPE = "Bearer ";
export const REQUEST_HEADER_AUTH_KEY = "Authorization";
export const API_URL = "/api/";
export const DEFAULT_ACTION = { type: "DEFAULT_ACTION" };
export const LOCALE = "en-US";

export enum EndpointUrls {
  // Albums - Auto
  albumsAuto = "/album/auto/",
  albumsAutoList = "/album/auto/",
  // Albums - Date
  albumsDate = "/album/date/",
  albumsDateList = "/album/date/",
  // Albums - People
  albumsPeople = "/album/people/",
  // Albums - Place
  albumsPlace = "/album/place/",
  albumsPlaceList = "/album/place/",
  // Albums - Thing
  albumsThing = "/album/thing/",
  albumsThingList = "/album/thing/",
  // Albums - User
  albumsUser = "/album/user/",
  albumsUserEdit = "/album/user/edit/",
  albumsUserList = "/album/user/list/",
  // Auth
  authObtain = "/auth/token/obtain/",
  authRefresh = "/auth/token/refresh/",
  // Faces
  faces = "/faces/",
  facesIncomplete = "/faces/incomplete/",
  tasksFacesCluster = "/faces/cluster/",
  tasksFacesDelete = "/faces/delete/",
  tasksFacesLabel = "/faces/label/",
  tasksFacesScan = "/faces/scan/",
  tasksFacesTrain = "/faces/train/",
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
  tasksDownload = "/photos/download/",
  tasksPhotosDeleteMissing = "/photos/delete/missing/",
  tasksPhotosDownload = "/photos/download/",
  tasksPhotosMonthCounts = "/photos/month-counts/",
  tasksPhotosScan = "/photos/scan/",
  tasksPhotosFullScan = "/photos/scan/full/",
  tasksPhotosScanUploaded = "/photos/scan/uploaded/",
  tasksPhotosEditDelete = "/photos/edit/delete/",
  tasksPhotosEditDuplicateDelete = "/photos/edit/duplicate/delete/",
  tasksPhotosEditFavorite = "/photos/edit/favorite/",
  tasksPhotosEditHide = "/photos/edit/hide/",
  tasksPhotosEditCaptionGenerate = "/photos/edit/caption/generate/",
  tasksPhotosEditCaptionSave = "/photos/edit/caption/save/",
  tasksPhotosEditSetDeleted = "/photos/edit/set-deleted/",
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
  tasksQueueAvailability = "/queue-availability/",
  tasksRulesDefault = "/rules/default/",
  tasksRulesPredefined = "/rules/predefined/",
  tasksSearchExampleTerms = "/search-term-examples/",
  tasksUpload = "/upload/",
  tasksUploadComplete = "/upload/complete/",
  tasksZipDelete = "/delete/zip/",
  // Timezones
  timezones = "/timezones/",
  // User
  user = "/user/",
  userManage = "/user/manage/",
  userDelete = "/user/delete/",
  // Visual
  visualDirTree = "/dir-tree/",
  visualImageTag = "/image-tag/",
  visualLocationClusters = "/location/clusters/",
  visualLocationSunburst = "/location/sunburst/",
  tasksLocationTimeline = "/location/timeline/",
  visualSocialGraph = "/social-graph/",
  visualWordCloud = "/word-cloud/",
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
