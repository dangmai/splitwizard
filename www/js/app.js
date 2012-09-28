/*global requirejs*/
// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
		"bootstrap-datepicker": 'bootstrap-datepicker/js/bootstrap-datepicker',
        'jquery-ui': [
            '//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min',
            'jquery-ui'
        ]
    },
	shim: {
        // JqueryUI and Bootstrap Datepicker both use $.datepicker, so it is
        // necessary that BD loads later in order to override JQueryUI's.
		'bootstrap-datepicker': ['jquery', 'jquery-ui'],
        'jquery-ui': ['jquery'],
        'jquery.cookie': ['jquery']
	}
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);
