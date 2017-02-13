jn.create('contacts', function () {
    var items = ['email', 'links', 'city'].map(function(item) {
        return jn.exec('contacts__line', {
            key: '[% lang:contacts.' + item + '.key %]',
            value: '[% lang:contacts.' + item + '.value %]'
        });
    });

    return jn.exec('contacts__layout', {
        items: items.join('')
    });
});
