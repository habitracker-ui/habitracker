import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcImg = 'C:/Users/User/.gemini/antigravity-ide/brain/1a38154d-0d35-4c4b-94e7-c98213ce03c2/habit_icon_512_1789415128313.jpg'
const publicDir = join(__dirname, '..', 'public')

async function generate() {
  await sharp(srcImg).resize(512, 512).png().toFile(join(publicDir, 'icon-512.png'))
  console.log('✓ icon-512.png')

  await sharp(srcImg).resize(192, 192).png().toFile(join(publicDir, 'icon-192.png'))
  console.log('✓ icon-192.png')

  await sharp(srcImg).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'))
  console.log('✓ apple-touch-icon.png')
}

generate().catch(console.error)
