jn.create('top', function () {
    return jn.exec('columns', {
        cls: 'top',
        left: [
            jn.exec('h', {text: '[% lang:head.hello %]'}),
            jn.exec('p', {text: '[% lang:head.desc %]'})
        ].join(''),
        right: jn.exec('contacts')
    });
});
