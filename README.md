# malmaarmals.nl
The LekkerSpelen Twitch archive.

Aims to be an archive website to archive lost media from the old and new Twitch streams of LekkerSpelen.

## Features
- 99% of old and new Twitch streams archived
- 98% of chat messages archived
- Chat replay + partial emoticon support
- Accurate chapters + timestamps
- Statistics for chat and games played
- Needs to be subscribed to LekkerSpelen on Twitch
- Custom playlists

*have more ideas? create a PR!*

## Todo
- Missing sub-badges on messages. I simply do not have that data.
- Better emote support
- Playlist autoplay
- Suggested video's below current video
- Missing around 20 streams
- Missing around 40 chat logs

*Want to help? create a PR!*

*Questions? don't hesitate to contact via PR as well*

## Development
```bash
npm run start:dev
```

### Notes:
- You will see data from the production database, but cannot modify the data.
- If you want to login locally, click the login button and copy the credentials from the url before being redirected to malmaarmals.nl and paste the `access_token` onto your localhost url ex: `http://localhost:5173/auth/callback#access_token=eyJhbGc...`
