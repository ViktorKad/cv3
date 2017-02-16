jn.create('contacts', function () {
    var items = ['email', 'links', 'city'];

    return jn.exec('contacts__layout', {
        keys: items.map(function(item) {
            return jn.exec('contacts__line', {
                text: '[% lang:contacts.' + item + '.key %]'
            });
        }).join(''),
        values: items.map(function(item) {
            return jn.exec('contacts__line', {
                text: '[% lang:contacts.' + item + '.value %]'
            });
        }).join('')
    });
});
