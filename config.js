var srcAssets = 'src';
var config = {
    src: srcAssets + '/images/*.png',
    dest: {
        css: srcAssets + '/scss/base/',
        image: srcAssets + '/images/sprites/'
    },
    options: {
        cssName: '_sprites.scss',
        cssFormat: 'css',
        cssOpts: {
            cssClass: function(item) {
                // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
                if (item.name.indexOf('-hover') !== -1) {
                    return '.icon-' + item.name.replace('-hover', ':hover');
                    // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
                } else {
                    return '.icon-' + item.name;
                }
            }
        },
        imgName: 'icon-sprite.png',
        imgPath: 'sprites/icon-sprite.png'
    }
};

module.exports = config;