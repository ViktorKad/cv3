jn.create('history', function() {
    var result = [],
        TOTAL_COUNT = 6,
        cls, left, right, tmp;

    for (var i = 0; i < TOTAL_COUNT; i++) {
        cls = (i === 0 ? 'timeline_first' : '');
        cls = (i === TOTAL_COUNT - 1 ? 'timeline_last' : cls);

        left = jn.exec('timeline__date', {
            date: '[% lang:history.' + i + '.date %]'
        });

        right = jn.exec('timeline__desc', {
            label: '[% lang:history.' + i + '.label %]',
            position: '[% lang:history.' + i + '.position %]',
            desc: '[% lang:history.' + i + '.desc %]'
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

    return result.join('');
});
