import fs from 'fs'
import path from 'path'
import { GroupAvatar } from '../src'

import test from 'blue-tape'

const avatarBuffer = fs.readFileSync(path.join(
  __dirname,
  './assets/avatar.png',
))

test('Should generate group avatar with different numbers correctly', async t => {
  for (let i = 1; i < 26; i++) {

    const expectedPath = path.join(__dirname, `./assets/expected/${i}.png`);
    const expectedAvatar = fs.readFileSync(expectedPath);

    const memberAvatars = [];
    for (let j = 0; j < i; j++) {
      memberAvatars.push(avatarBuffer);
    }
    const groupAvatar = new GroupAvatar({
      memberAvatars,
      maxLines: 5,
    })  
    const actualAvatar = await groupAvatar.getAvatar()

    t.equals(actualAvatar.toString(), expectedAvatar.toString(), `${i} avatars should generate correctly.`)
  }
})
