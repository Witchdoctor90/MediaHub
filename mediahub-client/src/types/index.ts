export interface Photo {
  id: string;
  url: string;
  description: string;
  createdAt: string;
  albumId?: string;
  userId: string;
  reactions?: Reaction[];
  likesCount?: number;
  dislikesCount?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Reaction {
  id: string;
  reactionType: ReactionType;
  photoId: string;
  userId: string;
  createdAt: string;
}

export enum ReactionType {
  Like = 0,
  Dislike = 1,
}

export interface Album {
  id: string;
  title: string;
  photos?: Photo[];
  userId: string;
  coverPhoto?: Photo | null;
}
