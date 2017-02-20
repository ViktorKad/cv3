jn.create('edu-list', function() {
    var result = [],
        TOTAL_COUNT = 3,
        cls, left, right, tmp;

    for (var i = 0; i < TOTAL_COUNT; i++) {
        cls = (i === 0 ? 'timeline_first' : '');
        cls = (i === TOTAL_COUNT - 1 ? 'timeline_last' : cls);

        left = jn.exec('timeline__date', {
            date: '[% lang:edu.' + i + '.date %]'
        });

        right = jn.exec('timeline__desc', {
            label: '[% lang:edu.' + i + '.label %]',
            position: '[% lang:edu.' + i + '.position %]',
            desc: '[% lang:edu.' + i + '.desc %]'
        });

        if (i % 2) {
            tmp = left;
            left = right;
            right = tmp;
        }
        
        result.push(
            jn.exec('timeline', {
                cls: cls,
                left: left,
                right: right
            })
        );
    }

    return jn.exec('div', {
        cls: 'edu-list',
        content: result.join('') +
            jn.exec('footer', {
                content: '[% lang:edu.footer %]'
            })
    });
});
