jn.create('work-list', function() {
    var result = [],
        TOTAL_COUNT = 5,
        cls, left, right, tmp;

    for (var i = 0; i < TOTAL_COUNT; i++) {
        cls = (i === 0 ? 'timeline_first' : '');
        cls = (i === TOTAL_COUNT - 1 ? 'timeline_last' : cls);

        left = jn.exec('timeline__date', {
            date: '[% lang:work.' + i + '.date %]'
        });

        right = jn.exec('timeline__desc', {
            label: '[% lang:work.' + i + '.label %]',
            position: '[% lang:work.' + i + '.position %]',
            desc: '[% lang:work.' + i + '.desc %]'
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
        cls: 'work-list',
        content: result.join('') +
            jn.exec('footer', {
                content: '[% lang:work.footer %]'
            })
    });
});
