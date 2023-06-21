import { setupRecorder } from "nock-record";
import { expect, it } from "vitest";
import { Masterchat } from "../../src";

const record = setupRecorder({
  mode: (process.env.NOCK_BACK_MODE as any) || "lockdown",
});

it(
  "metadata",
  async () => {
    expect.assertions(4);

    const videoId = "dc9IBmKoDm8";

    const { completeRecording } = await record("metadata");

    const mc = await Masterchat.init(videoId);
    const metadata = await mc.fetchMetadataFromWatch(videoId);
    expect(mc.title).toBe(
      "【歌枠】月曜日から楽しく歌っちゃおう～🎶【白銀ノエル/ホロライブ】"
    );
    expect(metadata.viewCount).toBe(13712);
    expect(metadata.likes).toBe(6685);
    expect(metadata.subscribers).toBe(1630000);

    completeRecording();
  },
  20 * 1000
);
