# WordPress plugin to share drafts of posts

This is a simple plugin based of Neville Longbottom's initial work. It will allow you to generate magic urls to unpublished
that don't require authentication.

## Installation

You will need [node & npm](https://nodejs.org/en/) installed on your machine to build the plugin assets.

Then run

`npm build:prod`

After the js bundle is ready the last thing that is required is copying:

```
drafts-for-friends.php
admin-ajax.php
languages
build/bundle.js
```

either to your plugins directory or compressing them in a zip/tar archive and installing via WordPress admin panel.

## Tests

There are some JavaScript tests that you can run with

```
npm test
```

## Development

For development purposes check these two commands:

```
npm run build:watch
npm run test:watch
```

## License

MIT License. Do whatever you want with that.
