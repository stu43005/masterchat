import { unknown } from "..";
import { ShowPollPanelAction } from "../../interfaces/actions";
import {
  YTLiveChatPollRenderer,
  YTShowLiveChatActionPanelAction,
} from "../../interfaces/yt/chat";
import { debugLog, stringify } from "../../utils";
import { pickThumbUrl } from "../utils";

export function parseShowLiveChatActionPanelAction(
  payload: YTShowLiveChatActionPanelAction
) {
  const panelRdr = payload.panelToShow.liveChatActionPanelRenderer;

  if ("pollRenderer" in panelRdr.contents) {
    const rdr = panelRdr.contents.pollRenderer as YTLiveChatPollRenderer;
    const header = rdr.header.pollHeaderRenderer;
    const authorName = header.metadataText.runs[0].text;

    const question = header.pollQuestion
      ? stringify(header.pollQuestion)
      : undefined;
    if (!question) {
      debugLog("[action required] empty question (poll)", JSON.stringify(rdr));
    }

    const parsed: ShowPollPanelAction = {
      type: "showPollPanelAction",
      targetId: panelRdr.targetId,
      id: panelRdr.id,
      authorName,
      authorPhoto: pickThumbUrl(header.thumbnail),
      question,
      choices: rdr.choices,
      pollType: header.liveChatPollType,
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
