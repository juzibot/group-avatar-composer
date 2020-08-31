import Jimp from 'jimp'

import { GroupAvatarOptions, AvatarInCell } from './schema'

const LINE_WIDTH_PERCENT = 6

export class GroupAvatar {

  private memberAvatars: Buffer[];

  private size = 200;
  private maxLines = 3;

  constructor (options: GroupAvatarOptions) {
    this.memberAvatars = options.memberAvatars;
  }

  public async getAvatar (): Promise<Buffer> {

    const maxAvatars = this.maxLines * this.maxLines;
    const members = this.memberAvatars.slice(0, maxAvatars);
    const layout = this.getLayout(members.length);
    
    const groupAvatarCanvas = new Jimp(this.size, this.size, 0xd6d6d6ff);

    for (let i = 0; i < layout.length; i++) {
      const cell = layout[i];
      const avatar = await Jimp.read(this.memberAvatars[i]).then(j => j.resize(cell.size, cell.size));
      groupAvatarCanvas.composite(avatar, cell.x, cell.y);
    }

    return groupAvatarCanvas.getBufferAsync(Jimp.MIME_PNG);
  }

  private getLayout (totalMembers: number): AvatarInCell[] {    
    
    const lines = Math.ceil(Math.sqrt(totalMembers));
    const space = this.getSpace(lines);
    const avatarSize = this.getSingleAvatarSize(lines, space);
    const avatarCount = this.getAvatarCountInLines(totalMembers, lines);
    const result: AvatarInCell[] = [];

    const ys = this.getYs(avatarSize, avatarCount.length, space);
    for (let line = 0; line < avatarCount.length; line++) {
      const totalAvatarInLine = avatarCount[line];
      const xs = this.getXs(avatarSize, totalAvatarInLine, space);
      const y = ys[line];
      for (const x of xs) {
        result.push({ x, y, size: avatarSize });
      }
    }

    return result;
  }

  private getAvatarCountInLines (total: number, lines: number) {
    const counts: number[] = [];
    while (total > 0) {
      if (total > lines) {
        counts.push(lines);
      } else {
        counts.push(total);
      }
      total -= lines;
    }
    return counts.reverse();
  }

  private getXs (cellSize: number, total: number, space: number) {
    const left = (this.size - (cellSize * total + (total - 1) * space)) / 2;
    const results = [left];
    for (let i = 1; i < total; i++) {
      results.push(left + i * (cellSize + space));
    }
    return results;
  }

  private getYs (cellSize: number, lines: number, space: number) {
    const top = (this.size - (cellSize * lines + (lines - 1) * space)) / 2;
    const results = [top];
    for (let i = 1; i < lines; i++) {
      results.push(top + i * (cellSize + space));
    }
    return results;
  }

  private getSingleAvatarSize (lines: number, space?: number) {
    if (lines === 1) {
      lines = 2;
    }
    if (!space) {
      space = this.getSpace(lines);
    }

    return (this.size - space * (lines + 1)) / lines;
  }

  private getSpace (lines: number) {
    return this.size / lines / (100 + LINE_WIDTH_PERCENT) * LINE_WIDTH_PERCENT;
  }
}
