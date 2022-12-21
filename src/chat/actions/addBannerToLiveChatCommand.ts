import { unknown } from "..";
import {
  AddBannerAction,
  AddIncomingRaidBannerAction,
  AddOutgoingRaidBannerAction,
  AddProductBannerAction,
} from "../../interfaces/actions";
import { YTAddBannerToLiveChatCommand } from "../../interfaces/yt/chat";
import { debugLog, endpointToUrl, stringify, tsToDate } from "../../utils";
import { parseBadges } from "../badge";
import { pickThumbUrl } from "../utils";

export function parseAddBannerToLiveChatCommand(
  payload: YTAddBannerToLiveChatCommand
) {
  // add pinned item
  const bannerRdr = payload["bannerRenderer"]["liveChatBannerRenderer"];

  if (
    bannerRdr.header &&
    bannerRdr.header.liveChatBannerHeaderRenderer.icon.iconType !== "KEEP"
  ) {
    debugLog(
      "[action required] Unknown icon type (addBannerToLiveChatCommand)",
      JSON.stringify(bannerRdr.header)
    );
  }

  // banner
  const actionId = bannerRdr.actionId;
  const targetId = bannerRdr.targetId;
  const viewerIsCreator = bannerRdr.viewerIsCreator;
  const isStackable = bannerRdr.isStackable;

  // contents
  const contents = bannerRdr.contents;

  if ("liveChatTextMessageRenderer" in contents) {
    const rdr = contents.liveChatTextMessageRenderer;
    const id = rdr.id;
    const message = rdr.message.runs;
    const timestampUsec = rdr.timestampUsec;
    const timestamp = tsToDate(timestampUsec);
    const authorName = stringify(rdr.authorName);
    const authorPhoto = pickThumbUrl(rdr.authorPhoto);
    const authorChannelId = rdr.authorExternalChannelId;
    const { isVerified, isOwner, isModerator, membership } = parseBadges(rdr);

    // header
    const header = bannerRdr.header!.liveChatBannerHeaderRenderer;
    const title = header.text.runs;

    if (!authorName) {
      debugLog(
        "[action required] Empty authorName found at addBannerToLiveChatCommand",
        JSON.stringify(rdr)
      );
    }

    const parsed: AddBannerAction = {
      type: "addBannerAction",
      actionId,
      targetId,
      id,
      title,
      message,
      timestampUsec,
      timestamp,
      authorName,
      authorPhoto,
      authorChannelId,
      isVerified,
      isOwner,
      isModerator,
      membership,
      viewerIsCreator,
      contextMenuEndpointParams:
        rdr.contextMenuEndpoint?.liveChatItemContextMenuEndpoint.params,
    };
    return parsed;
  } else if ("liveChatBannerRedirectRenderer" in contents) {
    const rdr = contents.liveChatBannerRedirectRenderer;
    const targetVideoId =
      "watchEndpoint" in rdr.inlineActionButton.buttonRenderer.command
        ? rdr.inlineActionButton.buttonRenderer.command.watchEndpoint.videoId
        : undefined;

    const photo = pickThumbUrl(rdr.authorPhoto);

    if (targetVideoId) {
      // Outgoing
      const targetName = rdr.bannerMessage.runs[1].text;
      const payload: AddOutgoingRaidBannerAction = {
        type: "addOutgoingRaidBannerAction",
        actionId,
        targetId,
        targetName,
        targetPhoto: photo,
        targetVideoId,
      };
      return payload;
    } else {
      // Incoming
      const sourceName = rdr.bannerMessage.runs[0].text;
      const payload: AddIncomingRaidBannerAction = {
        type: "addIncomingRaidBannerAction",
        actionId,
        targetId,
        sourceName,
        sourcePhoto: photo,
      };
      return payload;
    }
  } else if ("liveChatProductItemRenderer" in contents) {
    const rdr = contents.liveChatProductItemRenderer;
    const title = rdr.title;
    const description = rdr.accessibilityTitle;
    const thumbnail = rdr.thumbnail.thumbnails[0].url;
    const price = rdr.price;
    const vendorName = rdr.vendorName;
    const creatorMessage = rdr.creatorMessage;
    const creatorName = rdr.creatorName;
    const authorPhoto = pickThumbUrl(rdr.authorPhoto);
    const url = endpointToUrl(rdr.onClickCommand)!;
    if (!url) {
      debugLog(
        `Empty url at liveChatProductItemRenderer: ${JSON.stringify(rdr)}`
      );
    }
    const dialogMessage =
      rdr.informationDialog.liveChatDialogRenderer.dialogMessages;
    const isVerified = rdr.isVerified;
    const payload: AddProductBannerAction = {
      type: "addProductBannerAction",
      actionId,
      targetId,
      viewerIsCreator,
      isStackable,
      title,
      description,
      thumbnail,
      price,
      vendorName,
      creatorMessage,
      creatorName,
      authorPhoto,
      url,
      dialogMessage,
      isVerified,
    };
    return payload;
  } else if ("liveChatCallForQuestionsRenderer" in contents) {
    debugLog(
      "[TODO, action required] implement liveChatCallForQuestionsRenderer in parseAddBannerToLiveChatCommand"
    );
    /*
     [action required] Unrecognized content type found in parseAddBannerToLiveChatCommand: {"bannerRenderer":{"liveChatBannerRenderer":{"contents":{"liveChatCallForQuestionsRenderer":{"creatorAvatar":{"thumbnails":[{"url":"https://yt4.ggpht.com/hI-shJC2UnZcXRsZjKAPHXfEabW3KpiyeTtHTu1lkDvuwyJHYX4daHJ1g7nMW75Y-D36ba7EB3o=s32-c-k-c0x00ffffff-no-rj","width":32,"height":32},{"url":"https://yt4.ggpht.com/hI-shJC2UnZcXRsZjKAPHXfEabW3KpiyeTtHTu1lkDvuwyJHYX4daHJ1g7nMW75Y-D36ba7EB3o=s64-c-k-c0x00ffffff-no-rj","width":64,"height":64}]},"featureLabel":{"simpleText":"Q&A"},"contentSeparator":{"simpleText":"·"},"overflowMenuButton":{"buttonRenderer":{"icon":{"iconType":"MORE_VERT"},"accessibility":{"label":"Chat actions"},"trackingParams":"CAcQ8FsiEwiqrZ3ytIn8AhXBDX0KHZ3kALE=","accessibilityData":{"accessibilityData":{"label":"Chat actions"}},"command":{"clickTrackingParams":"CAcQ8FsiEwiqrZ3ytIn8AhXBDX0KHZ3kALE=","commandMetadata":{"webCommandMetadata":{"ignoreNavigation":true}},"liveChatItemContextMenuEndpoint":{"params":"Q2g0S0hBb2FRMGt0YlRGUE5qQnBabmREUmxkWlNISlJXV1EwT0ZGSVRXY2FLU29uQ2hoVlEyYzNjMWN0YURGUVZXOTNaR2xTTlVzMFNHeENaWGNTQzNsRmVVbGxMVXBPWkVkM0lBRW9BVElhQ2hoVlEyYzNjMWN0YURGUVZXOTNaR2xTTlVzMFNHeENaWGM0QVVnQVVCNCUzRA=="}}}},"creatorAuthorName":{"simpleText":"Lia Ch. 鈴香アシェリア 【Phase Connect】"},"questionMessage":{"runs":[{"text":"ASK"}]}}},"actionId":"ChwKGkNJLW0xTzYwaWZ3Q0ZXWUhyUVlkNDhRSE1n","viewerIsCreator":false,"targetId":"live-chat-banner","onCollapseCommand":{"clickTrackingParams":"CAEQl98BIhMIqq2d8rSJ_AIVwQ19Ch2d5ACx","elementsCommand":{"setEntityCommand":{"identifier":"EihDaHdLR2tOSkxXMHhUell3YVdaM1EwWlhXVWh5VVZsa05EaFJTRTFuIIsBKAE%3D","entity":"CkJFaWhEYUhkTFIydE9Ta3hYTUhoVWVsbDNZVmRhTTFFd1dsaFhWV2g1VlZac2EwNUVhRkpUUlRGdUlJc0JLQUUlM0QQAQ=="}}},"onExpandCommand":{"clickTrackingParams":"CAEQl98BIhMIqq2d8rSJ_AIVwQ19Ch2d5ACx","elementsCommand":{"setEntityCommand":{"identifier":"EihDaHdLR2tOSkxXMHhUell3YVdaM1EwWlhXVWh5VVZsa05EaFJTRTFuIIsBKAE%3D","entity":"CkJFaWhEYUhkTFIydE9Ta3hYTUhoVWVsbDNZVmRhTTFFd1dsaFhWV2g1VlZac2EwNUVhRkpUUlRGdUlJc0JLQUUlM0QQAA=="}}},"isStackable":true}}}
    */
    return unknown(payload);
  } else {
    debugLog(
      `[action required] Unrecognized content type found in parseAddBannerToLiveChatCommand: ${JSON.stringify(
        payload
      )}`
    );
    return unknown(payload);
  }
}
