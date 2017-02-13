jn.create('about-techs', function() {

    return jn.exec('columns', {
        cls: 'about-techs',
        left: jn.exec('box', {
            content: '[% lang:techs.text1 %]'
        }),
        right: jn.exec('text', {
            text: '[% lang:techs.text2 %]'
        })
    });
});