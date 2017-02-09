jn.create('top', function () {
    return jn.exec('columns', {
        left: jn.exec('contacts'),
        right: jn.exec('box', {
            content: [
                jn.exec('p', {text: '[% lang:head.hello %]'}),
                jn.exec('p', {text: '[% lang:head.desc %]'})
            ].join('')
        })
    });
});
