(function() {
    var oldOnload = window.onload,
        LS_KEY = 'vk.gh.cv3.menu';

    window.onload = function() {
        if (oldOnload) {
            oldOnload();
        }

        var body = document.body,
            menuItems = Array.from(document.getElementsByClassName('menu__item')),
            lsValue;

        try {
            lsValue = localStorage.getItem(LS_KEY);
            home.setMod(body, 'body', 'page', lsValue);
            menuItems.forEach(function(item) {
                home.setMod(item, 'menu__item', 'selected', 'no');

                if (home.attr(item, 'data-menu') === lsValue) {
                    home.setMod(item, 'menu__item', 'selected', 'yes');
                }
            });
        } catch (e) {/*pass*/}

        menuItems.forEach(function(item) {
            item.onclick = function() {
                var menuValue = home.attr(this, 'data-menu');

                menuItems.forEach(function(item) {
                    home.setMod(item, 'menu__item', 'selected', 'no');
                });
                home.setMod(this, 'menu__item', 'selected', 'yes');
                home.setMod(body, 'body', 'page', menuValue);

                try {
                    localStorage.setItem(LS_KEY, menuValue);
                } catch (e) {/*pass*/}
            };
        });
    };
})();