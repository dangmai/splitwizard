SplitWizard [![Build Status](https://travis-ci.org/dangmai/splitwizard.png)](https://travis-ci.org/dangmai/splitwizard)
===========


About
-----

The source code for [SplitWizard](http://splitwizard.com).
This is the project I use to incorporate all the knowledge about modern Javascript (circa 2012) that I learn so far,
so there are bound to be issues.
Feel free to fork and submit pull requests.

The project uses [volo](http://volojs.org) for front-end dependencies,
and [npm](http://npmjs.org) for [Node](http://nodejs.org) dependencies (building and testing purposes).

Installation
------------

The website requires no server-side language,
so it is a matter of building and copy-pasting the files in www-built into some folder on your Apache server
(so far, Apache is required because of the use of .htaccess for cache-bursting).
To build:

```
npm install && npm run build

```


After the build completes,
move everything in `www-built` to `${APACHE_DOCUMENT_ROOT}/splitwizard`,
and the site should be working.

The easier way to build (and run) this is to use [Rocker](https://github.com/grammarly/rocker),
which is a wrapper around [Docker](https://www.docker.com/):

```
rocker build
docker run -d -p 80:80 splitwizard

```

If you just want to spin up the website using the official Docker image,
it's easiest just to run:

```
docker run -d -p 80:80 dangmai/splitwizard
```


Tests
-----

To run tests:

```
npm install && npm test
```

Development
-----------
Make sure to disable cache in your browser while developing.
