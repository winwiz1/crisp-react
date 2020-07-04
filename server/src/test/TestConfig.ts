import { SampleModelConfig } from "../api/models/SampleModel";
import { JsonParsingError, SampleRequest } from "../api/types/SampleTypes";

type TestRequest = {
  name: string;
};

type GenderTuple = [
  // name
  string,
  // gender
  "female"|"male",
  // probability
  number];

export class TestConfig {
  static readonly getValidNames = (): ReadonlyArray<string> => {
    const names = [
      "Tim",
      "ALICE",
      "tom",
    ];

    return names;
  }

  static readonly getInvalidNames = (): ReadonlyArray<string|undefined> => {
    const names = [
      "Tim#",
      "to<m",
      "Alice$1234567890",
      "1",
      "name(alias)version",
      "delete * from users",
      "drop&nbsp;users",
      undefined
    ];

    return names;
  }

  static readonly getGenderTuples = (): ReadonlyArray<GenderTuple> => {
    const tuples = [
      ["Alice", "female", 0.75] as GenderTuple,
      ["Bob", "male", 0.75] as GenderTuple
    ];

    return tuples;
  }

  static readonly getStockTestRequest = (): TestRequest => {
    return {
      name: "Jerry",
    };
  }

  static readonly getRequestAsString = (req: TestRequest): string => {
    const obj = JSON.stringify({
      name: req.name
    });
    return obj;
  }

  static readonly getRequestAsJson = (req: TestRequest): any | undefined => {
    const ret = JSON.parse(TestConfig.getRequestAsString(req));
    return ret;
  }

  static readonly getRequest = (
    req: TestRequest,
    clientAddress = "10.10.11.12"): SampleRequest | undefined => {
    const ret = TestConfig.getRequestAsJson(req);
    const errInfo: JsonParsingError = { message: undefined };
    return ret ? SampleRequest.fromJson(ret, clientAddress, errInfo) : undefined;
  }

  static readonly getModelConfig = (
    dataLimitClient: number | undefined = undefined,
    dataLimitInstance: number | undefined = undefined): SampleModelConfig => {
    return new SampleModelConfig(
      dataLimitClient,
      dataLimitInstance
    );
  }
}
