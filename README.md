The BillSplitter project.

This project uses volo to manage dependencies for the front-end, as well as
node, npm and PhantomJS to run tests (both headlessly and in the browser).

To run tests:
phantomjs node_modules/mocha-phantomjs/lib/mocha-phantomjs.coffee www/js/app/test/runner.html

