require.config({
    paths: {
        jquery: 'jquery-1.9.1'
    }
});
 
require(['jquery'], function($) {
    alert($().jquery);
});