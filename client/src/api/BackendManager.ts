/*
  1. In fullstack build (yarn build, yarn build:prod) BackendManager calls
  the API endpoint exposed by the backend and not the API provided by a cloud
  service. This arrangement ensures:
    - There is no room for CORS security violations (and therefore no need to
      relax the security by using CORS HTTP headers) because the script bundle
      with this code was downloaded from the same backend.
    - The client doesn't have the credentials required by the cloud service.
    - The API call limit imposed on the client can be implemented independently
      from the client.
  2. In Jamstack build (yarn build:jamstack) the backend is not built and
  BackendManager calls the API endpoint provided by the cloud service directly.
*/
import { fetchAdapter, IFetch } from "../utils/fetch";
import { CustomError } from "../utils/error";
import { isError, isCustomError, isString } from "../utils/typeguards";
import { IBackendRequestData, BackendRequest } from "./BackendRequest";
import {
  ISampleData,
  SampleRetrieval,
  SampleRetrievalData,
  SampleRetrievalResult,
  SampleRequest
} from "@backend/types/SampleTypes";
import { perfStart } from "../utils/misc";

export {
  SampleRetrieval,
  SampleRetrievalData,
  SampleRetrievalResult
};

// Extend data storage interface and add data fetching capability.
interface IBackendClient extends ISampleData {
  readonly fetch: (request: IBackendRequestData) => Promise<boolean>;
}

export class BackendManager implements IBackendClient {
  constructor(signal: AbortSignal) {
    this.m_signal = signal;
  }

  get Data(): SampleRetrieval {
    return this.m_queryResult;
  }

  public readonly fetch = async (request: IBackendRequestData): Promise<boolean> => {
    try {
      this.m_queryParams = new BackendRequest(request);
      await this.fetchData();
    } catch (err) {
      if (isError(err)) {
        this.m_queryResult = err;
      } else {
        throw err;
      }
    }
    // Returns 'true' to facilitate timeout handling (implemented as
    // racing with another Promise that returns 'false').
    return Promise.resolve(true);
  }

  static get RegexName(): RegExp {
    return SampleRequest.RegexName;
  }

  /********************** private methods and data ************************/

  private fetchData = async (): Promise<void> => {
    const fetchProps: IFetch = {
      abortSignal: this.m_signal,
      body: CF_PAGES? undefined : this.m_queryParams.toString(),
      errorHandler: this.errorHandler,
      isJson: CF_PAGES? false : true,
      method: CF_PAGES? "GET" : "POST",
      successHandler: this.successHandler,
      targetPath: CF_PAGES?
        "https://api.genderize.io/?name=" + this.m_queryParams.toString() :
        BackendManager.s_targetPath,
    };

    await fetchAdapter(fetchProps);
    perfStart("fetch");
  }

  private successHandler = (data: any): void => {
    const result = BackendManager.parser(data);

    if (result) {
      this.m_queryResult = result;
    } else if (isError(data)) {
      this.m_queryResult = data as Error;
    } else if (isString(data)) {
      this.m_queryResult = new Error(data as string);
    } else {
      this.m_queryResult = new CustomError(
        "Unexpected backend responce data, please contact Support.",
        "Details: " + Object.getOwnPropertyNames(data).map(key => `${key}: ${data[key] || "no data"}`).join("\n")
      );
    }
  }

  private errorHandler = (err: CustomError): void => {
    if (isCustomError(err)) {
      this.m_queryResult = err;
    } else {
      this.m_queryResult = new CustomError(
        "Unexpected backend error data, please contact Support.",
        "Details: " + Object.getOwnPropertyNames(err).map(key => `${key}: ${err[key] || "no data"}`).join("\n")
      );
    }
  }

  private static parser = (inputObj: Record<string, unknown>): SampleRetrievalResult | undefined => {
    const obj: SampleRetrievalResult = Object.create(SampleRetrievalResult.prototype);
    const ret = Object.assign(obj, CF_PAGES? { response: inputObj } : inputObj);
    const propNames = ["response"];
    // eslint-disable-next-line no-prototype-builtins
    const hasProps = propNames.every(prop => ret.hasOwnProperty(prop));

    return hasProps ? ret : undefined;
  }

  private m_queryParams: BackendRequest;
  private m_queryResult: SampleRetrieval = new Error("<query not attempted>");
  private readonly m_signal: AbortSignal;
  private static readonly s_targetPath = SampleRequest.Path;
}
