/***********************************************************************
*  Types related to data received from cloud API service
***********************************************************************/

// The 'main' or 'central' data piece from the response
// provided by API server
export class SampleRetrievalData {
  readonly name?: string;
  readonly gender?: "male" | "female";
  readonly probability?: number;
  readonly count?: number;
}

export function isSampleRetrievalData(obj: unknown): obj is SampleRetrievalData {
  if (obj instanceof Object === false) {
    return false;
  }

  const objInstance = obj as object;

  return keyIsInObj<SampleRetrievalData>("name", objInstance) &&
         keyIsInObj<SampleRetrievalData>("gender", objInstance) &&
         keyIsInObj<SampleRetrievalData>("probability", objInstance);
}

function keyIsInObj<T extends object>(key: PropertyKey, obj: T): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// API response. Contains the 'main' piece of data
// and auxillary response data which in this project is none.
// See the sibling Crisp BigQuery project for more realistic sample.
export class SampleRetrievalResult {
  constructor(
    public response: SampleRetrievalData
  ) {
  }
}

/*
   API data
*/
export type SampleRetrieval = SampleRetrievalResult | Error;

/*
   API data storage interface.
   A component that implements this interface can store API response
   data and return it via '.Data' getter.
*/
export interface ISampleData {
  readonly Data: SampleRetrieval;
}

/******************************************************************************
*  Types related to constructing a request used to query the cloud API service
******************************************************************************/

type LaxString = string | undefined | null;

interface ISampleRequest {
  readonly name: string;
  readonly clientAddress: string;
}

export type JsonParsingError = { message?: string };

/*
  Class SampleRequest used to parse and validate a JSON request received from the client.
*/
export class SampleRequest {
  // Factory method. Returns undefined when fails in which case _errInfo
  // is set to a meaningful value.
  // Keeping constructor private ensures all attempts to instantiate the
  // class have to use this method (and the input data validation it uses).
  static fromJson(
    // eslint-disable-next-line
    objJson: any,
    clientAddress: string,
    errInfo: JsonParsingError): SampleRequest | undefined {
    try {
      // Security considerations driven approach: assume every piece of data
      // in the incoming API request is malicious until proven otherwise.
      const dataJson: ISampleRequest = {
        clientAddress: SampleRequest.getClientAddress(clientAddress),
        name: SampleRequest.getName(objJson.name),
      };
      SampleRequest.validateRequestParams(dataJson);
      return new SampleRequest(dataJson);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : (
        "Exception: <" +
        Object.keys(err).map((key) => `${key}: ${err[key] ?? "no data"}`).join("\n") +
        ">"
      );

      errInfo.message = `Request parsing failed, error: ${errMsg}`;
      return undefined;
    }
  }

  get Name(): string {
    return this.m_name;
  }

  get ClientAddress(): string {
    return this.m_clientAddress;
  }

  static get Path(): string {
    return SampleRequest.s_queryPath;
  }

  static get RegexName(): RegExp {
    return SampleRequest.s_regexName;
  }

  /********************** private methods and data ************************/

  private constructor(data: ISampleRequest) {
    this.m_name = data.name;
    this.m_clientAddress = data.clientAddress;
  }

  private static validateRequestParams(params: ISampleRequest): void {
    if (SampleRequest.isUndefined(params.name)) {
      throw new Error("Parameter 'name' is invalid");
    }
  }

  private static isString(x: any): x is string {
    return typeof x === "string" && x.length > 0;
  }

  private static isUndefined(x: any): boolean {
    return typeof x === "undefined" ? true : false;
  }

  private static isClientAddressValid(str: string): boolean {
    // Comes from server and not from client, therefore apply
    // simplified validation without Regex
    return !!str;
  }

  private static isNameValid(str: LaxString): boolean {
    if (SampleRequest.isString(str)) {
      return SampleRequest.s_regexName.test(str);
    }
    return false;
  }

  private static getClientAddress(str: string): string {
    if (!str) {
      throw new TypeError("Parameter 'clientAddress' is missing");
    }
    if (!SampleRequest.isClientAddressValid(str)) {
      throw new EvalError("Parameter 'clientAddress' is invalid");
    }
    return str;
  }

  private static getName(str: LaxString): string {
    const err = "Parameter 'name' is missing";
    if (!str) {
      throw new EvalError(err);
    }
    const ret = str.trim();
    if (!ret) {
      throw new EvalError(err);
    }
    if (!SampleRequest.isNameValid(ret)) {
      throw new EvalError("Parameter 'name' is invalid");
    }
    return ret;
  }

  private readonly m_name: string;
  private readonly m_clientAddress: string;

  private static readonly s_queryPath = "/api/sample/1.0";
  // Regex must be either simple or constructed using a library that provides DOS protection.
  private static readonly s_regexName = /^[a-zA-Z]{1,32}$/;
}
