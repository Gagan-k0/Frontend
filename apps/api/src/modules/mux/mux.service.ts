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
        playback_policy: ['signed'],
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

  async getSignedPlaybackToken(playbackId: string): Promise<string> {
    // The Mux SDK v8+ handles token signing differently, or we can use jsonwebtoken directly.
    // Given the SDK might throw missing SyntaxKind or something if we try to require the wrong file,
    // we can use standard jsonwebtoken if we prefer, but let's try the SDK first.
    try {
      const token = await this.mux.jwt.signPlaybackId(playbackId, {
        type: 'video',
        expiration: '2h',
      });
      return token;
    } catch (e: any) {
      if (e.message && e.message.includes('signPlaybackId is not a function')) {
        // Fallback for some Mux SDK versions if jwt is not initialized properly
        const jwt = require('jsonwebtoken');
        return jwt.sign(
          { 
            sub: playbackId, 
            aud: 'video', 
            exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60), 
            kid: process.env.MUX_SIGNING_KEY 
          }, 
          Buffer.from(process.env.MUX_SIGNING_SECRET || '', 'base64'),
          { algorithm: 'RS256' } // Note: Mux uses RS256 with base64 decoded secret
        );
      }
      throw e;
    }
  }
}
