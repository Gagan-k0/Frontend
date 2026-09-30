import { Injectable } from '@nestjs/common';
import Mux from '@mux/mux-node';

@Injectable()
export class MuxService {
  private mux: Mux;

  constructor() {
    this.mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });
  }

  async createDirectUpload() {
    const upload = await this.mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        video_quality: 'basic',
      },
      cors_origin: '*', // Allow uploads from our frontend
    });

    return {
      uploadId: upload.id,
      url: upload.url, // Frontend uses this URL to PUT the file
    };
  }

  async getAsset(assetId: string) {
    return this.mux.video.assets.retrieve(assetId);
  }

  async getPlaybackIdFromUpload(uploadId: string) {
    try {
      const upload = await this.mux.video.uploads.retrieve(uploadId);
      if (upload.status === 'asset_created' && upload.asset_id) {
        const asset = await this.mux.video.assets.retrieve(upload.asset_id);
        const playbackId = asset.playback_ids?.[0]?.id;
        return { status: 'ready', playbackId };
      }
      return { status: upload.status };
    } catch (e) {
      console.error("Error retrieving Mux upload", e);
      return { status: 'error' };
    }
  }
}
