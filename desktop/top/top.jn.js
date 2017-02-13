jn.create('top', function () {
    return jn.exec('top__layout', {
        imgSrc: './desktop/top/assets/top__photo.jpg',
        contacts: jn.exec('contacts')
    });
});
