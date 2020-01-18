/*
  Demonstates mocking
*/
import { SampleModel } from "../api/models/SampleModel";
import { SampleRetrieval  } from "../api/types/SampleTypes";
import { TestConfig } from "./TestConfig";

const mockMessage = "test-mock";

beforeAll(() => {
  jest.spyOn(SampleModel.prototype, "fetch").mockImplementation(async (_params: any) => {
    return Promise.resolve();
  });
  jest.spyOn(SampleModel.prototype, "getData").mockImplementation(() => {
    return new Error(mockMessage);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Test mocking", () => {
  const config = TestConfig.getModelConfig();
  SampleModel.Config = config;

  it("Mocks selected methods of SampleModel class", async () => {
    const bqRequest = TestConfig.getRequest(TestConfig.getStockTestRequest());
    expect(bqRequest).toBeDefined();

    const model = SampleModel.Factory;
    await model.fetch(bqRequest!);
    const data: SampleRetrieval = model.getData();

    expect(data).toBeInstanceOf(Error);
    const err = data as Error;
    expect(err.message).toContain(mockMessage);
  });
});
