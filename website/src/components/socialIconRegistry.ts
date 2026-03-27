import type { SimpleIcon } from 'simple-icons'
import {
  siBluesky,
  siDiscord,
  siFacebook,
  siGithub,
  siInstagram,
  //siLinkedin,
  siMastodon,
  siPinterest,
  siReddit,
  siSnapchat,
  siTelegram,
  siThreads,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from 'simple-icons/icons'

const socialIconSources: Record<string, SimpleIcon> = {
  x: siX,
  twitter: siX,
  facebook: siFacebook,
  instagram: siInstagram,
  //linkedin: siLinkedin,
  youtube: siYoutube,
  github: siGithub,
  reddit: siReddit,
  mastodon: siMastodon,
  snapchat: siSnapchat,
  telegram: siTelegram,
  whatsapp: siWhatsapp,
  discord: siDiscord,
  pinterest: siPinterest,
  tiktok: siTiktok,
  threads: siThreads,
  bluesky: siBluesky,
}

export function getSocialIcon(platform: string | undefined): SimpleIcon | undefined {
  if (!platform) {
    return undefined
  }

  return socialIconSources[platform.trim().toLowerCase()]
}

export const SOCIAL_ICON_VIEWBOX = '0 0 24 24'
