
import { SampleModel } from "../api/models/SampleModel";
import { SampleRetrieval, SampleRetrievalResult } from "../api/types/SampleTypes";
import { TestConfig } from "./TestConfig";

describe("Testing SampleModel", () => {
  const timeout = 5000;                           // 5 sec
  const config = TestConfig.getModelConfig();
  SampleModel.Config = config;

  it("tests API call", async () => {
    const testReq = TestConfig.getStockTestRequest();
    const model = SampleModel.Factory;

    TestConfig.getGenderTuples().forEach(async t => {
      testReq.name = t[0];
      const request = TestConfig.getRequest(testReq);
      await model.fetch(request!);
      const data: SampleRetrieval = model.Data;
      expect(data).toBeInstanceOf(SampleRetrievalResult);

      const result = data as SampleRetrievalResult;
      expect(result.response.gender).toBe(t[1]);
      expect(result.response.probability).toBeGreaterThan(t[2]);
    });
  }, timeout
  );

  it("tests the API call limit imposed on a client", async () => {
    const configWithLimit = TestConfig.getModelConfig(1/*API call only*/);
    SampleModel.Config = configWithLimit;
    const model = SampleModel.Factory;
    const testReq = TestConfig.getStockTestRequest();
    const request = TestConfig.getRequest(testReq);
    // the first call
    await model.fetch(request!);
    let data: SampleRetrieval = model.Data;
    expect(data).toBeInstanceOf(SampleRetrievalResult);
    // the second call
    await model.fetch(request!);
    data = model.Data;
    expect(data).toBeInstanceOf(Error);
    expect((data as Error).message).toContain("limit");
  }, timeout
  );
});
