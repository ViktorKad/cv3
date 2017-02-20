jn.create('history', function() {
    var result = [],
        prefix = 'work',
        TOTAL_COUNT = 6;

    for (var i = 0; i < TOTAL_COUNT; i++) {
        if (i > 2) {
            prefix = 'edu';
        }

        result.push(
            jn.exec('block', {
                cls: (i % 2 ? 'history block_theme_dark history_right' : 'history block_theme_dark'),
                title: jn.exec('history__title', {
                    text: '[% lang:' + prefix + '.' + (i > 2 ? i - 3 : i) + '.date %]'
                }),
                content: [
                    jn.exec('history__label', {
                        text: '[% lang:' + prefix + '.' + (i > 2 ? i - 3 : i) + '.label %]'
                    }),
                    jn.exec('history__position', {
                        text: '[% lang:' + prefix + '.' + (i > 2 ? i - 3 : i) + '.position %]'
                    }),
                    jn.exec('history__desc', {
                        text: '[% lang:' + prefix + '.' + (i > 2 ? i - 3 : i) + '.desc %]'
                    })
                ].join('')
            })
        );
    }

    return result.join('');
});
