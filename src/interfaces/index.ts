import { Action } from "./actions";
import { TimedContinuation } from "./misc";
import { EmojiFountainDataEntity } from "./yt/context";

export * from "./actions";
export * from "./context";
export * from "./contextActions";
export * from "./misc";
export * from "./transcript";
export * from "./yt";

export interface Metadata {
  videoId: string;
  channelId: string;
  channelName?: string;
  title?: string;
  isLive?: boolean;
}

export interface ChatResponse {
  actions: Action[];
  continuation: TimedContinuation | undefined;
  emojiFountainData?: EmojiFountainDataEntity;
  error: null;
}

export interface Credentials {
  SAPISID: string;
  APISID: string;
  HSID: string;
  SID: string;
  SSID: string;

  /**
   * @deprecated Use DELEGATED_SESSION_ID
   */
  SESSION_ID?: string;

  /**
   * Delegated session id for brand account
   */
  DELEGATED_SESSION_ID?: string;
}
