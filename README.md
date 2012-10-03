#About
The source code for [SplitWizard](http://splitwizard.com). This is the project I use to incorporate all the knowledge about modern Javascript that I learn so far, so there are bound to be issues. Feel free to fork and submit pull requests.

The project uses [volo](http://volojs.org) for front-end dependencies, and [npm](http://npmjs.org) for [Node](http://nodejs.org) dependencies (building and testing purposes).

#Installation
The website requires no server-side language, so it is a matter of building and copy-pasting the files in www-built into some folder on your Apache server (so far, Apache is required because of the use of .htaccess for cache-bursting). Then, change the path to 404.html in .htaccess to wherever that file is on your server.
To build:

`cd your_split_wizard_folder`

`npm install`

`node ./node_modules/volo/bin/volo build`

#Tests
To run tests:

`cd your_split_wizard_folder`

`npm install`

`phantomjs node_modules/mocha-phantomjs/lib/mocha-phantomjs.coffee www/js/app/test/runner.html`

Or if you rather run it a browser:

`cd your_split_wizard_folder`

`npm install`

Then browse to `www/js/app/test/runner.html` on your browser of choice.

#Development
Make sure to disable cache in your browser while developing.