import { unknown } from "..";
import { ShowPollPanelAction } from "../../interfaces/actions";
import {
  YTLiveChatPollRenderer,
  YTShowLiveChatActionPanelAction,
} from "../../interfaces/yt/chat";
import { debugLog } from "../../utils";
import { pickThumbUrl } from "../utils";

export function parseShowLiveChatActionPanelAction(
  payload: YTShowLiveChatActionPanelAction
) {
  const panelRdr = payload.panelToShow.liveChatActionPanelRenderer;

  if ("pollRenderer" in panelRdr.contents) {
    const rdr = panelRdr.contents.pollRenderer as YTLiveChatPollRenderer;
    const authorName = rdr.header.pollHeaderRenderer.metadataText.runs[0].text;

    const parsed: ShowPollPanelAction = {
      type: "showPollPanelAction",
      targetId: panelRdr.targetId,
      id: panelRdr.id,
      choices: rdr.choices,
      question: rdr.header.pollHeaderRenderer.pollQuestion?.simpleText,
      authorName,
      authorPhoto: pickThumbUrl(rdr.header.pollHeaderRenderer.thumbnail),
      pollType: rdr.header.pollHeaderRenderer.liveChatPollType,
    };

    return parsed;
  } else {
    debugLog(
      "[action required] unrecognized rendererType (parseShowLiveChatActionPanelAction):",
      JSON.stringify(payload)
    );
    return unknown(payload);
  }
}
