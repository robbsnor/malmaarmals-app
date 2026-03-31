# malmaarmals.nl

The Lekker Spelen Twitch archive.\
Aims to be an archive website to archive lost media from the old and new Twitch streams of Lekker Spelen.

_<sup>Build with: Vue 3, Vuetify 3, Tailwind 4 and VueUse</sup>_

## Features

- 99% of old and new Twitch streams archived
- 98% of chat messages archived
- Chat replay + partial emoticon support
- Accurate chapters + timestamps
- Statistics for chat and games played
- Subscribtion to Lekker Spelen on Twitch required to watch videos
- Custom playlists

_have more ideas? create an issue!_

## Todo

- ~~Missing sub-badges on messages. I simply do not have that data.~~
- ~~More emote support, now only supporting some emotes based on strings~~
- Desktop video controls
- Playlist autoplay
- Suggested videos below current video
- History page resoponsive
- Missing around 20 streams
- Missing around 40 chat logs

_Want to help? create an issue!_

_Questions? don't hesitate to contact via a issue as well_

## Development

1. Fork and clone project
2. Copy `.env.sample` to `.env`
3. Install packages

```bash
npm ci
```

4. Run dev server

```bash
npm run start:dev
```

### Notes:

- You will see data from the production database, but cannot modify the data.
- If you want to login locally, click the login button and copy the credentials from the url before being redirected to malmaarmals.nl and paste the `access_token` onto your localhost url ex: `http://localhost:5173/auth/callback#access_token=eyJhbGc...`.\
  Session stays active for 30 min.
