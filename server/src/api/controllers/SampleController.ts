/*
  The class SampleController adds and handles Express API route.
*/
import * as express from "express";
import { SampleModel, SampleModelConfig } from "../models/SampleModel";
import {
  SampleRequest,
  SampleRetrievalResult, JsonParsingError
} from "../types/SampleTypes";
import {
  CustomError,
  isError,
  isCustomError,
} from "../../utils/error";

const jsonParser = express.json({
  inflate: true,
  limit: "1kb",
  strict: true,
  type: "application/json"
});

/*
  API route handler
*/
export class SampleController {
  static readonly addRoute = (app: express.Application): void => {
    app.post(SampleRequest.Path,
      jsonParser,
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          // Once-off configuration
          if (!SampleController.s_configSet) {
            const config = new SampleModelConfig();
            SampleModel.Config = config;
            SampleController.s_configSet = true;
          }

          // Request related error handling
          const errInfo: JsonParsingError = { message: undefined };
          const sampleRequest = SampleRequest.fromJson(req.body, req.ip, errInfo);
          if (!sampleRequest) {
            const err = new CustomError(400, SampleController.s_ErrMsgParams, true);
            err.unobscuredMessage = `Invalid request from ${req.ip} with hostname ${req.hostname} using path ${req.originalUrl}. `;
            !!errInfo.message && (err.unobscuredMessage += errInfo.message);
            return next(err);
          }

          // Ask the static factory to create an instance of the model
          // and use it to get the data
          const model = SampleModel.Factory;
          await model.fetch(sampleRequest);
          const data = model.Data;

          // Response related error handling
          if (data instanceof Error) {
            if (isCustomError(data)) {
              return next(data as CustomError);
            }
            const error = new CustomError(500, SampleController.s_ErrMsgSample, true, true);
            // Can only be set to "<no data>" if code is incorrectly modified
            error.unobscuredMessage = (data as Error).message ?? "<no data>";
            return next(error);
          } else {
            res.status(200).json(data as SampleRetrievalResult);
          }
        } catch (err) {
          if (isCustomError(err)) {
            return next(err);
          }
          const error = new CustomError(500, SampleController.s_ErrMsgSample, true, true);
          const errMsg: string = isError(err) ? err.message : (
            "Exception: <" +
            Object.keys(err).map((key) => `${key}: ${err[key] ?? "no data"}`).join("\n") +
            ">"
          );
          error.unobscuredMessage = errMsg;
          return next(error);
        }
      });
  }

  /********************** private data ************************/

  private static s_configSet = false;
  private static readonly s_ErrMsgSample = "Could not query Sample API. Please retry later. If the problem persists contact Support";
  private static readonly s_ErrMsgParams = "Invalid data retrieval parameter(s). Please notify Support";
}
