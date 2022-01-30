/*
  The Model.
  Communicates with cloud service.
  Performs asynchronous API requests.
*/
import nodeFetch from "../../utils/node-fetch";
import * as  NodeCache from "node-cache";
import { logger } from "../../utils/logger";
import { CustomError } from "../../utils/error";
import {
   SampleRetrievalData,
   isSampleRetrievalData,
   ISampleData,
   SampleRequest,
   SampleRetrieval,
   SampleRetrievalResult
} from "../types/SampleTypes";

/*
  Model configuration.
*/
export class SampleModelConfig {
  constructor(
    // Daily limit on API requests per client address
    private limitDailyClient = SampleModelConfig.s_limitDailyClient,
    // Daily limit on API requests per backend instance
    private limitDailyInstance = SampleModelConfig.s_limitDailyInstance
  ) {

    if (limitDailyClient <= 0 || limitDailyClient > SampleModelConfig.s_limitDailyClient) {
        throw new RangeError("Client API call limit is invalid");
    }

    if (limitDailyInstance <= 0 || limitDailyInstance > SampleModelConfig.s_limitDailyInstance) {
      throw new RangeError("Instance API call limit is invalid");
    }
  }

  public readonly setClientDailyLiImit = (limit: number): void => {
    if (typeof limit !== "number" || !Number.isInteger(limit)) {
      throw new TypeError("Client API call limit is not an integer");
    }

    if (limit <= 0 || limit > SampleModelConfig.s_limitDailyClient) {
      throw new RangeError("Client API call limit is invalid");
    }

    this.limitDailyClient = limit;
  }

  public readonly getClientDailyLimit = (): number => {
    return this.limitDailyClient;
  }

  public readonly getInstanceDailyLimit = (): number => {
    return this.limitDailyInstance;
  }

  // Default daily API call limit per client address
  private static readonly s_limitDailyClient = 10;
  // Default daily API call limit per backend instance
  private static readonly s_limitDailyInstance = 1000;

}

/*
  Model interface.
  Extends the data storage interface by adding data fetching capability.
*/
export interface ISampleFetcher extends ISampleData {
  readonly fetch: (param: SampleRequest) => Promise<void>;
}

/*
  Model implementation.
  Usage:
  1. Use .Config setter once to set the configuration.
  2. Use .Factory getter one or many times to get an instance of the class.
  3. Use the instance of the class to await .fetch().
  4. Use .Data getter to get either the data fetched or an Error object.

  See SampleModel.test.ts for an example.
*/
export class SampleModel implements ISampleFetcher {
  static initialize(): void {
    SampleModel.s_cache.on("expired", SampleModel.handleCacheExpiry);
  }

  static set Config(config: SampleModelConfig) {
    SampleModel.s_config = config;
  }

  static get Factory(): SampleModel {
    const ret = new SampleModel();
    // do some extra work the model might require
    return ret;
  }

  public async fetch(quoteRequest: SampleRequest): Promise<void> {
    this.m_request = quoteRequest;

    const dataUsage = this.getDataUsage(quoteRequest.ClientAddress);
    // Check data usage per client
    if (dataUsage.client_data >= SampleModel.s_config!.getClientDailyLimit()) {
      const custErr = new CustomError(509, SampleModel.s_errLimitClient, false, false);
      custErr.unobscuredMessage = `Client ${quoteRequest.ClientAddress} has reached daily limit`;
      this.m_result = custErr;
      return;
    }
    // Check data usage by the backend instance
    if (dataUsage.instance_data >= SampleModel.s_config!.getInstanceDailyLimit()) {
      const custErr = new CustomError(509, SampleModel.s_errLimitInstance, false, false);
      custErr.unobscuredMessage = `Client ${quoteRequest.ClientAddress} request denied due to backend reaching its daily limit`;
      this.m_result = custErr;
      return;
    }

    await this.fetchData();
  }

  get Data(): SampleRetrieval {
    return this.m_result;
  }

  public getData(): SampleRetrieval {
    return this.m_result;
  }

  /********************** private methods and data ************************/

  private constructor() {
    if (!SampleModel.s_config) {
      throw new Error("SampleModelConfig is undefined");
    }
  }

  private async fetchData(): Promise<void> {
    const request = this.m_request as SampleRequest;

    try {
      const url = "https://api.genderize.io/?name=" + request.Name;
      const response = await nodeFetch(url);
      const responseData = await response.json();

      if (!isSampleRetrievalData(responseData)) {
        throw new TypeError("Invalid data received from cloud API endpoint");
      }

      const data = responseData as SampleRetrievalData;
      this.m_result = new SampleRetrievalResult(data);
      this.adjustDataUsage(request.ClientAddress);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (
        "Exception: <" +
        Object.keys(err).map((key) => `${key}: ${err[key] ?? "no data"}`).join("\n") +
        ">"
      );
      logger.error({ message: `API server call failed, error: ${errorMsg}` });
      this.m_result = new Error(SampleModel.s_errMsg,
                                //@ts-ignore
                                { ...(err instanceof Error && {cause: err}) });
    }
  }

  private static handleCacheExpiry = (cache_key: string, _value: any): void => {
    if (!cache_key) {
      return;
    }

    logger.info({ msg: `Cache key ${cache_key} has expired`});
  }

  // TODO Use durable cache
  private getDataUsage(clientAddress: string):
      {
        // Client address
        client_key: string,
        // Count of API calls made by the client
        client_data: number,
        // Count of API calls made by the backend instanc
        instance_data: number
      } {
    if (!clientAddress) {
      const errMsg = "SampleModel.getDataUsage - missing clientAddress";
      logger.error({ message: errMsg });
      throw new Error(errMsg);
    }

    const clientKey = SampleModel.s_limitPrefix + clientAddress;
    const cacheData = SampleModel.s_cache.mget([
      clientKey,
      SampleModel.s_limitInstance
    ]);
    const clientData = typeof cacheData[clientKey] === "number" ?
      cacheData[clientKey] as number : 0;
    const instanceData = typeof cacheData[SampleModel.s_limitInstance] === "number" ?
      cacheData[SampleModel.s_limitInstance] as number : 0;
    return { client_key: clientKey, client_data: clientData, instance_data: instanceData };
  }

  // TODO Use durable cache
  private adjustDataUsage(clientAddress: string, usageCount: number = 1) {
    if (usageCount === 0) {
      return;
    }

    const { client_key, client_data, instance_data } = this.getDataUsage(clientAddress);

    const ret = SampleModel.s_cache.mset([
      { key: client_key,
        ttl: SampleModel.s_limitCleanupInterval,
        val: client_data + usageCount,
      },
      { key: SampleModel.s_limitInstance,
        ttl: SampleModel.s_limitCleanupInterval,
        val: instance_data + usageCount,
      }
    ]);

    if (!ret) {
      const errMsg = "Failed to store API call counts in the cache";
      logger.error({ message: errMsg });
      throw new Error(errMsg);
    }
  }

  private m_request?: SampleRequest = undefined;
  private m_result: SampleRetrieval = new Error("API server call not attempted");

  private static s_config?: SampleModelConfig = undefined;
  private static readonly s_errMsg = "Failed to query the API server. Please retry later. If the problem persists contact Support";
  private static readonly s_errLimitClient = "The daily API call limit has been reached. Please contact Support if you feel this limit is inadequate.";
  private static readonly s_errLimitInstance = "Temporary unable to call the API server. Please contact Support.";
  private static readonly s_limitPrefix = "apilimit_";
  private static readonly s_limitInstance = "apilimit_instance";
  private static readonly s_limitCleanupInterval = 3600 * 24;

  private static readonly s_cache = new NodeCache({
    checkperiod: 900,
    deleteOnExpire: true,
    stdTTL: SampleModel.s_limitCleanupInterval,
    useClones: false
  });
}

SampleModel.initialize();
