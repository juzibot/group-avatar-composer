import fs from 'fs'
import path from 'path'
import { GroupAvatar } from '../src'

const main = async () => {
  const avatarBuffer = fs.readFileSync(path.join(
    __dirname,
    './assets/avatar.png',
  ))
  
  const groupAvatar = new GroupAvatar({
    memberAvatars: [avatarBuffer, avatarBuffer, avatarBuffer, avatarBuffer, avatarBuffer ]
  })

  const groupA = await groupAvatar.getAvatar()
  fs.writeFileSync('./generateAvatar.png', groupA, { flag: 'w' })
}

main()
