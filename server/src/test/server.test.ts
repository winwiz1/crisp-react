/**
 * Express tests using Supertest Library and
 * Jest as the testing framework.
 */
import * as request from "supertest";
import Server, { StaticAssetPath } from "../srv/server";
import * as SPAs from "../../config/spa.config";
import { SampleModel } from "../api/models/SampleModel";
import { TestConfig } from "./TestConfig";
import {
  SampleRequest,
  SampleRetrievalData,
  SampleRetrievalResult,

} from "../api/types/SampleTypes";

const server = Server(StaticAssetPath.SOURCE);
const regexResponse = new RegExp(SPAs.appTitle);
const testName = "Peter";
const testGender = "male";
const testProbability = 0.987;

beforeAll(() => {
  jest.spyOn(SampleModel.prototype, "fetch").mockImplementation(async (_params: any) => {
    return Promise.resolve();
  });
  jest.spyOn(SampleModel.prototype, "Data", "get").mockImplementation(() => {
    const data: SampleRetrievalData = {
      count: 123,
      gender: testGender,
      name: testName,
      probability: testProbability,
    };

    const ret = new SampleRetrievalResult(data);
    return ret;
  });
});

// Test that webserver does serve SPA landing pages.
// If there are two SPAs in spa.config.js called 'first and 'second',
// then set the array to:  ["/", "/first", "/second"]
const statusCode200path = SPAs.getNames().map(name => "/" + name);
statusCode200path.push("/");

// Test that the fallback tolerance does have its limits.
const statusCode404path = [
  "/abc%xyz;", "/images/logo123.png", "/static/invalid"
];

describe("Test Express routes", () => {
  const config = TestConfig.getModelConfig();
  SampleModel.Config = config;

  it("test URLs returning HTTP status 200", () => {
    statusCode200path.forEach(async path => {
      const response = await request(server).get(path);
      expect(response.status).toBe(200);
      expect(response.text).toMatch(regexResponse);
    });
  });

  it("test invalid URLs causing HTTP status 404", () => {
    statusCode404path.forEach(async path => {
      const response = await request(server).get(path);
      expect(response.status).toBe(404);
    });
  });
});

describe("Test API route", () => {
  it("test delivery of fetched data", async () => {
    const strRequest = TestConfig.getRequestAsString(TestConfig.getStockTestRequest());

    const response = await request(server)
      .post(SampleRequest.Path)
      .set("Content-Type", "application/json")
      .send(strRequest);

    const obj: SampleRetrievalResult = Object.create(SampleRetrievalResult.prototype);
    const data = Object.assign(obj, response.body);
    expect(data.response.name).toBe(testName);
    expect(data.response.gender).toBe(testGender);
    expect(data.response.probability).toBe(testProbability);
  });
});
