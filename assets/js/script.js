require.config({
    baseUrl: 'assets/js',
    paths: {
        jquery: 'jquery.min'
    }
});

require(["jquery", "threebythree"], function($, threebythree) {
    $(document).ready(function() {
		threebythree.init();
    });
});