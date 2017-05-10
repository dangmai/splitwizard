SplitWizard [![Build Status](https://travis-ci.org/dangmai/splitwizard.png)](https://travis-ci.org/dangmai/splitwizard)
===========

[![Greenkeeper badge](https://badges.greenkeeper.io/dangmai/splitwizard.svg)](https://greenkeeper.io/)


About
-----

The source code for [SplitWizard](http://splitwizard.com).
This is the project I use to incorporate all the knowledge about modern Javascript (circa 2016) that I learn so far,
so there are bound to be issues.
Feel free to fork and submit pull requests.

The project uses [npm](http://npmjs.org) for front-end and [Node](http://nodejs.org) dependencies (building and testing purposes).
It is a single page application,
using [React](https://facebook.github.io/react/) for the view layer,
[Redux](https://github.com/reactjs/redux) for state management,
and [Webpack](https://webpack.github.io/) as the module bundler.


Installation
------------

The website requires no server-side language,
so it is a matter of building and copy-pasting the files in `dist` into the root of your favorite web server.

To build:

```
npm install && npm run build

```

The easier way to build (and run) this is to use [Rocker](https://github.com/grammarly/rocker),
which is a wrapper around [Docker](https://www.docker.com/):

```
rocker build
docker run -d -p 80:2015 dangmai/splitwizard:latest

```

If you just want to spin up the website using the official Docker image,
it's easiest just to run:

```
docker run -d -p 80:2015 dangmai/splitwizard:latest
```

This will spin up a Docker container, which runs the [Caddy](https://caddyserver.com/) web server.
If you supply `HOST` and `EMAIL` as the environmental variables to the container,
Caddy will automatically generate a SSL certificate for the website.
In that case, you need to bind to ports 80 and 443 of the container instead of port 2015.


Tests
-----

To run tests:

```
npm install && npm test
```

History
-------

This project has always been the go to for me to learn more about Javascript development.
It was originally created in 2012 with a very different stack (volo, bower, RequireJS, Apache).

Obviously the Javascript front end landscape looks very different now.

However, the concept behind the project has been consistent throughout its existence,
and I will keep updating it as the front end world moves forward.