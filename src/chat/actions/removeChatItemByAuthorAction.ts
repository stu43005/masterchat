import { RemoveChatItemByAuthorAction } from "../../interfaces/actions";
import { YTRemoveChatItemByAuthorAction } from "../../interfaces/yt/chat";

export function parseRemoveChatItemByAuthorAction(
  payload: YTRemoveChatItemByAuthorAction
) {
  const parsed: RemoveChatItemByAuthorAction = {
    type: "removeChatItemByAuthorAction",
    channelId: payload.externalChannelId,
    timestamp: new Date(),
  };
  return parsed;
}
