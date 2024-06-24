import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { MaybePromise } from "@reduxjs/toolkit/dist/query/tsHelpers";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FetchArgs } from "@reduxjs/toolkit/query/react";

export type BaseQueryResult<T> = QueryReturnValue<T, FetchBaseQueryError, {}>;

export type BaseQuery<T> = (arg: string | FetchArgs) => MaybePromise<BaseQueryResult<T>>;

export type StatusResponse = { status: string };

export type DownloadResponse = {
  url: string;
  job_id: string;
};