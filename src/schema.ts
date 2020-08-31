export interface GroupAvatarOptions {
  memberAvatars: Buffer[],
  maxLines?: number,
  size?: number,
}

export interface AvatarInCell {
  x: number,
  y: number,
  size: number,
}
