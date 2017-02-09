jn.create('footer', function() {

    return jn.exec('columns', {
        cls: 'footer',
        left: [
            jn.exec('text', {text: '[% lang:footer.about.common %]'}),
            jn.exec('text', {text: '[% lang:footer.about.bank %]'}),
            jn.exec('text', {text: '[% lang:footer.about.yandex %]'})
        ].join(''),
        right: [
            jn.exec('text', {text: '[% lang:footer.mobile %]'}),
            jn.exec('text', {text: '[% lang:footer.github %]'}),
            jn.exec('text', {text: '[% lang:footer.past_cv %]'})
        ].join('')
    });
});
