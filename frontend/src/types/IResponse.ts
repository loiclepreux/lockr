// src/types/IResponse.ts
export interface IResponse<T> {
  data: T;
  dataType: string;
  timeStamp: string; // ← string côté frontend, pas Date
  // parce que le JSON sérialise les dates en string sur le réseau
}
