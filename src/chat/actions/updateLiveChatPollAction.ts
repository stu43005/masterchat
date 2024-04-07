import { UpdatePollAction } from "../../interfaces/actions";
import { YTUpdateLiveChatPollAction } from "../../interfaces/yt/chat";
import { debugLog, stringify } from "../../utils";
import { pickThumbUrl } from "../utils";

export function parseUpdateLiveChatPollAction(
  payload: YTUpdateLiveChatPollAction
) {
  const rdr = payload.pollToUpdate.pollRenderer;
  const header = rdr.header.pollHeaderRenderer;

  // "runs": [
  //   { "text": "朝陽にいな / Nina Ch." },
  //   { "text": " • " },
  //   { "text": "just now" },
  //   { "text": " • " },
  //   { "text": "23 votes" }
  // ]
  const meta = header.metadataText.runs;
  const authorName = meta[0].text;
  const elapsedText = meta[2].text;
  const voteCount = parseInt(meta[4].text.replace(/,/g, ""), 10);

  const question = header.pollQuestion
    ? stringify(header.pollQuestion)
    : undefined;
  if (!question) {
    debugLog("[action required] empty question (poll)", JSON.stringify(rdr));
  }

  const parsed: UpdatePollAction = {
    type: "updatePollAction",
    id: rdr.liveChatPollId,
    authorName,
    authorPhoto: pickThumbUrl(header.thumbnail),
    question,
    choices: rdr.choices,
    elapsedText,
    voteCount,
    pollType: header.liveChatPollType,
  };

  return parsed;
}
