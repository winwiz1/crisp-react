/**
 * Express tests using Supertest Library and
 * Jest as the testing framework.
 */

import * as request from "supertest";
import Server, { StaticAssetPath } from "../srv/server";
import * as SPAs from "../../config/spa.config";

const server = Server(StaticAssetPath.SOURCE);
const regexResponse = new RegExp(SPAs.appTitle);

// If there are two SPAs in spa.config.js called 'first and 'second',
  // then set the array to:  ["/", "/first", "/second"]
const statusCode200path = SPAs.getNames().map(name => "/" + name);
statusCode200path.push("/");

const statusCode303path = [
  "/a", "/b", "/ABC"
];
const statusCode404path = [
  "/abc%xyz;", "/images/logo123.png", "/static/invalid"
];

describe("Test Express routes", () => {
  it("test URLs returning HTTP status 200", () => {
    statusCode200path.forEach(async path => {
      const response = await request(server).get(path);
      expect(response.status).toBe(200);
      expect(response.text).toMatch(regexResponse);
    });
  });

  it("test URLs causing historyApiFallback with HTTP status 303", () => {
    statusCode303path.forEach(async (path) => {
      const response = await request(server).get(path);
      expect(response.status).toBe(303);
      expect(response.get("Location")).toBe("/");
    });
  });

  it("test invalid URLs causing HTTP status 404", () => {
    statusCode404path.forEach(async path => {
      const response = await request(server).get(path);
      expect(response.status).toBe(404);
    });
  });
});
