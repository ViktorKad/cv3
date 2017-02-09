jn.create('history', function() {
    var result = [],
        TOTAL_COUNT = 6;

    for (var i = 0; i < TOTAL_COUNT; i++) {
        result.push(
            jn.exec('block', {
                cls: (i % 2 ? 'history block_theme_dark history_right' : 'history block_theme_dark'),
                title: jn.exec('history__title', {
                    text: '[% lang:history.' + i + '.date %]'
                }),
                content: [
                    jn.exec('history__label', {
                        text: '[% lang:history.' + i + '.label %]'
                    }),
                    jn.exec('history__position', {
                        text: '[% lang:history.' + i + '.position %]'
                    }),
                    jn.exec('history__desc', {
                        text: '[% lang:history.' + i + '.desc %]'
                    })
                ].join('')
            })
        );
    }

    return result.join('');
});
