jn.create('footer', function() {
    var aboutMe = [];

    for (var i = 0; i < 5; i++) {
        aboutMe.push(
            jn.exec('footer__item', {
                content: jn.exec('footer__tech', {
                    name: '[% lang:techs.' + i + '.name %]',
                    desc: '[% lang:techs.' + i + '.desc %]'
                })
            })
        );
        
    }

    return [
        jn.exec('block', {
            cls: 'footer block_title_left',
            title: '[% lang:menu.about_techs %]',
            content: aboutMe.join('')
        }),
        jn.exec('block', {
            cls: 'block_theme_dark footer footer_last',
            title: '[% lang:menu.about_me %]',
            content: jn.exec('footer__about-me')
        })
    ].join('');
});