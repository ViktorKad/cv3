jn.create('footer', function() {
    return [
        jn.exec('block', {
            cls: 'block_title_off footer',
            content: jn.exec('footer__content')
        }),
        jn.exec('block', {
            cls: 'block_theme_dark block_title_off footer footer_last',
            content: jn.exec('footer__links')
        })
    ].join('')
});