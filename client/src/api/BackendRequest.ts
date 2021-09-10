/*
  Define the shape of the request used to make API call.
*/
export interface IBackendRequestData {
   readonly name: string;
}

export class BackendRequest {
   constructor(readonly requestData: IBackendRequestData) {
      if (!this.requestData.name) {
         // Can only happen if code is incorrectly modified
         throw new Error("Name is missing");
      }
   }

   public readonly toString = (): string => {
      return CF_PAGES? this.requestData.name : JSON.stringify({
         name: this.requestData.name
      });
   }
}
