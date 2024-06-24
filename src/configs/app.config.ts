import { LayoutTypes } from '@/@types/layout';

export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  enableMock: boolean;
  locale: string;
};

const appConfig: AppConfig = {
  apiPrefix: 'http://localhost:8000/api/',
  authenticatedEntryPath: '/photos',
  unAuthenticatedEntryPath: '/login',
  enableMock: true,
  locale: 'en',
};

export default appConfig;
