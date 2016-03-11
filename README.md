[![Build Status](https://travis-ci.org/dangmai/splitwizard.png)](https://travis-ci.org/dangmai/splitwizard)


#About
The source code for [SplitWizard](http://splitwizard.com). This is the project I use to incorporate all the knowledge about modern Javascript that I learn so far, so there are bound to be issues. Feel free to fork and submit pull requests.

The project uses [volo](http://volojs.org) for front-end dependencies, and [npm](http://npmjs.org) for [Node](http://nodejs.org) dependencies (building and testing purposes).

#Installation
The website requires no server-side language, so it is a matter of building and copy-pasting the files in www-built into some folder on your Apache server (so far, Apache is required because of the use of .htaccess for cache-bursting).
To build:

```
cd your_split_wizard_folder
npm install
npm install -g volo
volo build path_to_your_site_root
```

`path_to_your_site_root` is the path to wherever you will deploy the site, relative to Apache's DocumentRoot. For example, if your Apache's DocumentRoot is at `/home/public_html/` and you want to deploy in the subdirectory `splitwizard`, do:

`volo build /splitwizard/`

After the build completes, move the everything in `www-built` to `/home/public_html/splitwizard` and the site should be working.

#Tests
Tests are run using [PhantomJS](http://phantomjs.org/), so you must have it installed beforehand. To run tests:

```
cd your_split_wizard_folder
npm install
phantomjs node_modules/mocha-phantomjs/lib/mocha-phantomjs.coffee www/js/app/test/runner.html
```

Or if you rather run it a browser:

```
cd your_split_wizard_folder
npm install
```

Then browse to `www/js/app/test/runner.html` on your browser of choice.
Note: the test runner has to be served from a web server (tested on Apache, but should work on others), as the project depends on [RequireJS](http://requirejs.org/)'s [text](https://github.com/requirejs/text) module, which cannot be used from the `file://` context.

#Development
Make sure to disable cache in your browser while developing.
