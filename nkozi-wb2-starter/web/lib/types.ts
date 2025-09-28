export type Address = `0x${string}`;

export type User = {
  walletAddress: Address;
  username?: string;
  verified: boolean;
  artist?: boolean;
  earningsWLD: number;
};

export type Comment = { address: Address; text: string; ts: number };

export type Track = {
  id: string;
  title: string;
  artistWallet: Address;
  audioUrl: string;
  splitsBps: { artist: number; platform: number };
  likes: number;
  comments: Comment[];
  plays: number;
  createdAt: number;
};

export type ListenLog = {
  id: string;
  address: Address;
  trackId: string;
  ts: number;
  elapsedSec: number;
  full: boolean;
  credited: boolean;
  awardedWLD: number;
};
