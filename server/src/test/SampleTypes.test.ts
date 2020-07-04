import { JsonParsingError, SampleRequest } from "../api/types/SampleTypes";
import { TestConfig } from "./TestConfig";

const validAddress = "10.10.10.10";

describe("Testing SampleRequest with invalid data", () => {
  const errInfo: JsonParsingError = { message: undefined };

  it("should reject empty JSON object", () => {
    const obj = {};
    expect(SampleRequest.fromJson(obj, validAddress, errInfo)).not.toBeDefined();
  });

  it("should reject invalid JSON object", () => {
    const obj = {
      name: "1"
    };
    expect(SampleRequest.fromJson(obj, validAddress, errInfo)).not.toBeDefined();
  });

  it("should reject invalid names", () => {
    const reqJson = TestConfig.getRequestAsJson(TestConfig.getStockTestRequest());
    TestConfig.getInvalidNames().forEach(name => {
      reqJson.name = name;
      expect(TestConfig.getRequest(reqJson)).not.toBeDefined();
    });
  });
});

describe("Testing SampleRequest with valid data", () => {
  it("should accept valid names", () => {
    const reqJson = TestConfig.getRequestAsJson(TestConfig.getStockTestRequest());
    TestConfig.getValidNames().forEach(name => {
      reqJson.name = name;
      expect(TestConfig.getRequest(reqJson)).toBeDefined();
    });
  });
});
