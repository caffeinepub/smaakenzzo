import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import type { ActorSubclass } from "@icp-sdk/core/agent";
// @ts-ignore -- runtime JS module
import { idlFactory } from "./declarations/backend.did.js";
import type { _SERVICE } from "./declarations/backend.did.d";

export type backendInterface = {
  _initializeAccessControlWithSecret: (token: string) => Promise<void>;
};

export type CreateActorOptions = {
  agentOptions?: ConstructorParameters<typeof HttpAgent>[0];
  agent?: InstanceType<typeof HttpAgent>;
  processError?: (e: unknown) => never;
};

export class ExternalBlob {
  private _bytes?: Uint8Array;
  private _url?: string;
  onProgress?: (progress: number) => void;

  static fromURL(url: string): ExternalBlob {
    const b = new ExternalBlob();
    b._url = url;
    return b;
  }

  async getBytes(): Promise<Uint8Array> {
    if (this._bytes) return this._bytes;
    if (this._url) {
      const res = await fetch(this._url);
      const buf = await res.arrayBuffer();
      this._bytes = new Uint8Array(buf);
      return this._bytes;
    }
    return new Uint8Array();
  }

  getURL(): string | undefined {
    return this._url;
  }
}

export function createActor(
  canisterId: string,
  _uploadFile?: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile?: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): backendInterface {
  const agent = options?.agent ?? new HttpAgent(options?.agentOptions ?? {});
  const actor: ActorSubclass<_SERVICE> = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
  return actor as unknown as backendInterface;
}
