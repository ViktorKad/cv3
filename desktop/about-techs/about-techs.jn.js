jn.create('about-techs', function() {
    var content = [];
    for (var i = 0; i < 5; i++) {
        content.push(
            jn.exec('about-techs__line', {
                name: '[% lang:techs.' + i + '.name %]',
                desc: '[% lang:techs.' + i + '.desc %]'
            })
        );
    }

    return jn.exec('about-techs__layout', {
        lines: content.join('')
    });
});