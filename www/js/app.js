/*global requirejs*/
// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    // The baseUrl will only be used in development (because of the way our
    // .htaccess works), so there's no need to worry about changing the placeholder
    // in the build process (as everything will be included in ONE file already)
    // In development, there is no actual static or v.placeholder folder at all,
    // they are served by Apache.
    baseUrl: 'static/v.placeholder/js/lib',
    paths: {
        app: '../app',
		"bootstrap-datepicker": 'bootstrap-datepicker/js/bootstrap-datepicker',
        'jquery': [
            '//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min',
            'jquery'
        ],
        'moment': [
            '//cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.0/moment.min',
            'moment'
        ],
        'Modernizr': [
            '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min',
            'Modernizr'
        ],
        'json2': [
            '//cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2',
            'json2'
        ],
        'jquery.validate': [
            '//ajax.aspnetcdn.com/ajax/jquery.validate/1.10.0/jquery.validate.min',
            'jquery.validate'
        ]
    },
	shim: {
        'jquery.validate': ['jquery']
	}
});

requirejs(['app/main']);
