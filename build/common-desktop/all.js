/*- ./node_modules/jn/lib/client.jn.js @ -*/
(function() {
    'use strict';

    var ENV = (typeof global !== 'undefined') ? global : window;
    /**
     * _level          Текущий уровень переопределения шаблонов
     * _langStore      Словарь с переводами ({ключ: {язык1: значение, язык2: значение}, ...})
     * _lang           Текущий язык
     * _defaultLang    Язык по умолчанию (ищем в нем, если нет перевода на _lang)
     * _tmpls          Список существующих шаблонов
     * @type {Object}
     */
    ENV.jn = {
        _level: '',
        _langStore: {},
        _lang: 'ru',
        _defaultLang: 'ru',
        _tmpls: {}
    };

    jn.setLangStore = function(langStore) {
        jn._langStore = langStore;
    }

    jn.setLang = function(lang) {
        jn._lang = lang;
    }

    jn.setDefaultLang = function(lang) {
        jn._defaultLang = lang;
    }

    jn.setLevel = function(level) {
        jn._level = level;
    }

    /**
     * Создает шаблон из переданной строки.
     * 
     * @param  {String} name Имя шаблона.
     * @param  {String} tmpl Текст шаблона или функция, его возвращающая.
     * @return {void}
     */
    jn.create = function(name, tmpl) {
        let tmpJn = {};
        tmpJn[jn._level] = String(typeof tmpl === 'function' ? tmpl() : tmpl);

        if (typeof jn._tmpls[name] === 'undefined') {
            jn._tmpls[name] = [];
        }

        /* Нужен именно unshift, чтобы поиск происходил в правильном порядке */
        jn._tmpls[name].unshift(tmpJn);
    }

    /**
     * Раскрывает шаблон, подставляя данные из <i>data</i> в шаблон.
     * Вызывается рекурсивно, для раскрытия шаблона.
     * 
     * @param  {String} tmplCode Текст шаблона.
     * @param  {Object} data     Объект, содержащий поля с данными, для подстановки в шаблон.
     * @return {String}          Текст раскрытого шаблона.
     */
    jn._execDataAndTmpls = function(tmplCode, data) {
        let result = tmplCode,
            REPLACE_PATTERN = /\[%\s{1}[a-zA-Z0-9_\-]+\s%\]/g,
            REPLACE_PATTERN_LANG = /\[%\s{1}[a-zA-Z_-]+:{1}[a-zA-Z0-9_\-\.]+\s%\]/g,
            tmpName, replacable, replacableLang, keyArr;

        replacable = result.match(REPLACE_PATTERN) || [];

        replacable.forEach((item) => {
            var key = item.replace(/\s/g, '');
            key = key.substring(2, key.length - 2);
            
            if (data && data.hasOwnProperty(key)) {
                // Ищем свойство в перданных параметрах
                result = result.replace(new RegExp('\\[%\\s+' + key + '\\s+%\\]', 'g'), data[key]);
            } else if (jn.check(key)) {
                // Ищем шаблон с таким названием
                result = result.replace(new RegExp('\\[%\\s+' + key + '\\s+%\\]', 'g'), jn.read(key));
                return jn._execDataAndTmpls(result, data);
            } else {
                result = result.replace(new RegExp('\\[%\\s+' + key + '\\s+%\\]', 'g'), '');
            }
        });

        replacableLang = result.match(REPLACE_PATTERN_LANG) || [];

        replacableLang.forEach((item) => {
            var key = item.replace(/\s/g, ''),
                tmpTranslate;
            key = key.substring(2, key.length - 2);
            keyArr = key.split(':');

            if (typeof keyArr[1] === 'undefined') {return;}

            if (keyArr[0] === 'lang' && keyArr[1] in jn._langStore) {
                tmpTranslate = jn._langStore[keyArr[1]][jn._lang] || jn._langStore[keyArr[1]][jn._defaultLang] || '';

                result = result.replace(new RegExp('\\[%\\s+' + key + '\\s+%\\]', 'g'), tmpTranslate);
            }
        });

        return result;

    }

    /**
     * Раскрывает шаблон полученный с уровня <i>level</i>;
     *
     * @see jn.exec(name, data)
     * @param  {[type]} name  Имя шаблона.
     * @param  {[type]} level Уровень, с которого хотим получить шаблон. Например 'desktop' или 'common'.
     * @param  {[type]} data  Объект, содержащий поля с данными, для подстановки в шаблон.
     * @return {[type]}       Текст раскрытого шаблона. Или пустую строку, если шаблон не найден.
     */
    jn.execFrom = function(name, level, data) {
        var result = '',
            REPLACE_PATTERN = /\[%\s{1}[a-zA-Z0-9_-]+\s%\]/g,
            tmpName, replacable;
        
        if (typeof jn._tmpls[name] === 'undefined') {
            return result;
        }

        for (var i = 0; i < jn._tmpls[name].length; i++) {
            if (level in jn._tmpls[name][i]) {
                result = jn._execDataAndTmpls(jn._tmpls[name][i][level], data);
                break;
            }
        };

        return result;
    }

    /**
     * Раскрывает шаблон.
     *
     * @see jn._execDataAndTmpls
     * @param  {String} name Имя шаблона.
     * @param  {Object} data Объект, содержащий поля с данными, для подстановки в шаблон.
     * @return {String}      Текст раскрытого шаблона. Или пустую строку, если шаблон не найден.
     */
    jn.exec = function(name, data) {
        var result = '';

        if (typeof jn._tmpls[name] === 'undefined') {
            return result;
        }

        return jn.execFrom(name, Object.keys(jn._tmpls[name][0])[0], data);
    };

    /**
     * Читает шаблон и возвращает его в виде сырого текста.
     * 
     * @param  {String} name  Имя шаблона.
     * @param  {String} level Уровень, с которого хотим получить шаблон. Например 'desktop' или 'common'.
     * @return {String}       Текст шаблона в сыром виде (без изменений).
     */
    jn.readFrom = function(name, level) {
        var result = '';
        
        if (typeof jn._tmpls[name] === 'undefined') {
            return result;
        }

        for (var i = 0; i < jn._tmpls[name].length; i++) {
            if (level in jn._tmpls[name][i]) {
                result = jn._tmpls[name][i][level];
                break;
            }
        };

        return result;
    }

    /**
     * Читает шаблон и возвращает его в виде сырого текста.
     * 
     * @param  {String} name Имя шаблона.
     * @return {String}      Текст шаблона в сыром виде (без изменений).
     */
    jn.read = function(name) {
        return jn.readFrom(name, Object.keys(jn._tmpls[name][0])[0]);
    };

    /**
     * Проверяет, существует ли шаблон с именем <i>name</i>.
     * 
     * @param  {String} name Имя шаблона
     * @return {Boolean}     В случае, если шаблон существует, возвращает true. В противном случае - false.
     */
    jn.check = function(name) {
        return typeof jn._tmpls[name] !== 'undefined';
    }

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = jn;
    }
})(); 
/*- @ ./node_modules/jn/lib/client.jn.js -*/

jn.setLevel('common');
/*- common/contacts/contacts.jn.html @ -*/

jn.create('contacts__layout',
'<div class="contacts">' +
'    <div class="contacts__left">' +
'        [% keys %]' +
'    </div>' +
'    <div class="contacts__right">' +
'        [% values %]' +
'    </div>' +
'</div>');
jn.create('contacts__line',
'<div class="contacts__line">' +
'    [% text %]' +
'</div>'); 
/*- @ common/contacts/contacts.jn.html -*/
/*- common/contacts/contacts.jn.js @ -*/
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
 
/*- @ common/contacts/contacts.jn.js -*/
/*- common/inline/inline.jn.html @ -*/

jn.create('inline__js-detector',
'<script type="text/javascript">' +
'(function() {' +
'    // Проверка поддержки нужных css свойств' +
'    var techs = [' +
'        \'flex\',' +
'        \'justifyContent\',' +
'        \'alignContent\',' +
'        \'alignItems\',' +
'        \'flexShrink\',' +
'        \'flexGrow\',' +
'        \'flexBasis\'' +
'    ];' +
'' +
'    for (var i in techs) {' +
'        if (typeof techs[i] === \'undefined\') {' +
'            return;' +
'        }' +
'    }' +
'' +
'    window.isFlexboxOn = true;' +
'})();' +
'' +
'(function() {' +
'    var arr = [\'filter\', \'forEach\', \'map\', \'reduce\', \'some\', \'from\'];' +
'    // Проверка поддержки нужных js функций' +
'    for (var i = 0; i < arr.length; i++) {' +
'        if (!(Array.prototype[arr[i]] || Array[arr[i]])) {' +
'            return;' +
'        }' +
'    }' +
'' +
'    window.isGoodJsSupport = true;' +
'})();' +
'' +
'(function() {' +
'    var html = document.getElementsByTagName(\'html\')[0];' +
'' +
'    if (window.isFlexboxOn) {' +
'        setMod(html, \'flex\', \'support\', \'yes\');' +
'    }' +
'' +
'    if (window.isGoodJsSupport) {' +
'        setMod(html, \'js\', \'good\', \'yes\');' +
'    }' +
'' +
'    function setMod(elem, cls, mod, value) {' +
'        var SPLITTER_MOD = \'__\',' +
'            SPLITTER_VAL = \'_\';' +
'' +
'        elem.className = elem.className.split(\' \').map(function(item) {' +
'            var itemSplit = item.split(SPLITTER_MOD),' +
'                clsName = itemSplit[0],' +
'                modName = itemSplit[1].split(SPLITTER_VAL)[0];' +
'' +
'            if (clsName !== cls && modName !== mod) {' +
'                return item;' +
'            }' +
'' +
'            return clsName + SPLITTER_MOD + modName + SPLITTER_VAL + value;' +
'        }).join(\' \');' +
'    }' +
'})();' +
'</script>');
jn.create('inline__css-reset',
'<style type="text/css">' +
'/*' +
'http://meyerweb.com/eric/tools/css/reset/' +
'v2.0 | 20110126' +
'License: none (public domain)' +
'*/' +
'html, body, div, span, applet, object, iframe,' +
'h1, h2, h3, h4, h5, h6, p, blockquote, pre,' +
'a, abbr, acronym, address, big, cite, code,' +
'del, dfn, em, img, ins, kbd, q, s, samp,' +
'small, strike, strong, sub, sup, tt, var,' +
'b, u, i, center,' +
'dl, dt, dd, ol, ul, li,' +
'fieldset, form, label, legend,' +
'table, caption, tbody, tfoot, thead, tr, th, td,' +
'article, aside, canvas, details, embed,' +
'figure, figcaption, footer, header, hgroup,' +
'menu, nav, output, ruby, section, summary,' +
'time, mark, audio, video {' +
'    margin: 0;' +
'    padding: 0;' +
'    border: 0;' +
'    font-size: 100%;' +
'    font: inherit;' +
'    vertical-align: baseline;' +
'}' +
'/* HTML5 display-role reset for older browsers */' +
'article, aside, details, figcaption, figure,' +
'footer, header, hgroup, menu, nav, section {' +
'    display: block;' +
'}' +
'body {' +
'    line-height: 1;' +
'}' +
'ol, ul {' +
'    list-style: none;' +
'}' +
'blockquote, q {' +
'    quotes: none;' +
'}' +
'blockquote:before, blockquote:after,' +
'q:before, q:after {' +
'    content: \'\';' +
'    content: none;' +
'}' +
'table {' +
'    border-collapse: collapse;' +
'    border-spacing: 0;' +
'}' +
'</style>');
jn.create('inline__js-lib',
'<script type="text/javascript">' +
'(function() {' +
'    \'use strict\';' +
'    if (typeof window.home !== \'object\') {' +
'        window.home = Object.create(null);' +
'    }' +
'' +
'    home.attr = function(elem, name, value) {' +
'        if (typeof value === \'undefined\') {' +
'            return elem.getAttribute(name);' +
'        }' +
'' +
'        elem.setAttribute(name, value);' +
'' +
'        return elem;' +
'    }' +
'    ' +
'    window.home.setMod = function(elem, cls, mod, value) {' +
'        var SPLITTER_VAL = \'_\',' +
'            SPLITTER_CLS = \'__\',' +
'            isModExist = false;' +
'' +
'        elem.className = elem.className.trim().split(\' \').map(function(item) {' +
'            if (!item) {' +
'                return;' +
'            }' +
'' +
'            var itemSplitCls = item.split(SPLITTER_CLS);' +
'' +
'            if (!itemSplitCls[1]) {' +
'                return;' +
'            }' +
'' +
'            var itemSplitMod = itemSplitCls[1].split(SPLITTER_VAL),' +
'                modName = itemSplitMod[1],' +
'                clsName = itemSplitCls[0] + SPLITTER_CLS + itemSplitMod[0];' +
'            ' +
'            if (clsName !== cls) {' +
'                return item;' +
'            }' +
'            ' +
'            if (itemSplitMod.length === 2) {' +
'                isModExist = true;' +
'                return clsName + SPLITTER_VAL + value;' +
'            }' +
'' +
'            if (modName === mod) {' +
'                isModExist = true;' +
'                return clsName + SPLITTER_VAL + mod + SPLITTER_VAL + value;' +
'            }' +
'' +
'            return item;' +
'        }).join(\' \');' +
'' +
'        if (!isModExist) {' +
'            elem.className += \' \' + cls + SPLITTER_VAL + mod + SPLITTER_VAL + value;' +
'        }' +
'    }' +
'})();' +
'</script>'); 
/*- @ common/inline/inline.jn.html -*/
/*- common/tags/tags.jn.html @ -*/

jn.create('div',
'<div class="[% cls %]">' +
'    [% content %]' +
'</div>');
jn.create('link',
'<a class="link [% cls %]" href="[% href %]">' +
'    [% text %]' +
'</a>');
jn.create('p',
'<p class="[% cls %]">' +
'    [% text %]' +
'</p>');
jn.create('h2',
'<h2 class="[% cls %]">' +
'    [% text %]' +
'</h2>'); 
/*- @ common/tags/tags.jn.html -*/

jn.setLevel('desktop');
/*- desktop/about-me/about-me.jn.html @ -*/

jn.create('about-me',
'<div class="about-me">' +
'    <div class="about-me__content">' +
'        <p>[% lang:about_me.text1 %]</p>' +
'        <p>[% lang:about_me.text2 %]</p>' +
'        <p>[% lang:about_me.text3 %]</p>' +
'        <p>[% lang:about_me.text4 %]</p>' +
'        <div class="about-me__splitter"></div>' +
'        <p>[% lang:footer.mobile %]</p>' +
'        <p>[% lang:footer.github %]</p>' +
'        <p>[% lang:footer.past_cv %]</p>' +
'    </div>' +
'</div>'); 
/*- @ desktop/about-me/about-me.jn.html -*/
/*- desktop/about-techs/about-techs.jn.html @ -*/

jn.create('about-techs__layout',
'<div class="about-techs">' +
'    [% lines %]' +
'</div>');
jn.create('about-techs__line',
'<div class="about-techs__line">' +
'    <div class="about-techs__left">' +
'        [% name %]' +
'    </div>' +
'    <div class="about-techs__right">' +
'        [% desc %]' +
'    </div>' +
'</div>'); 
/*- @ desktop/about-techs/about-techs.jn.html -*/
/*- desktop/about-techs/about-techs.jn.js @ -*/
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
/*- @ desktop/about-techs/about-techs.jn.js -*/
/*- desktop/box/box.jn.html @ -*/

jn.create('box',
'<div class="box">' +
'    [% content %]' +
'</div>'); 
/*- @ desktop/box/box.jn.html -*/
/*- desktop/columns/columns.jn.html @ -*/

jn.create('columns',
'<div class="columns [% cls %]">' +
'    <div class="columns__left">' +
'        [% left %]' +
'    </div>' +
'    <div class="columns__right">' +
'        [% right %]' +
'    </div>' +
'</div>'); 
/*- @ desktop/columns/columns.jn.html -*/
/*- desktop/detector/detector.jn.html @ -*/
 
/*- @ desktop/detector/detector.jn.html -*/
/*- desktop/inline/inline.jn.html @ -*/
 
/*- @ desktop/inline/inline.jn.html -*/
/*- desktop/paranja/paranja.jn.html @ -*/

jn.create('paranja',
'<div class="paranja">' +
'    <div class="paranja__bg"></div>' +
'    <div class="paranja__content">' +
'        <p>[% lang:paranja.hello %]</p>' +
'        <p>[% lang:paranja.prev_version %]</p>' +
'    </div>' +
'</div>'); 
/*- @ desktop/paranja/paranja.jn.html -*/
/*- desktop/contacts/contacts.jn.html @ -*/
 
/*- @ desktop/contacts/contacts.jn.html -*/
/*- desktop/tags/tags.jn.html @ -*/
 
/*- @ desktop/tags/tags.jn.html -*/
/*- desktop/top/top.jn.html @ -*/

jn.create('top__layout',
'<div class="top">' +
'    <div class="top__photo">' +
'        <div class="top__img" style="background-image: url([% imgSrc %]);"></div>' +
'    </div>' +
'    <div class="top__hello">' +
'        <h2>[% lang:head.hello %]</h2>' +
'        <p>[% lang:head.desc %]</p>' +
'    </div>' +
'    <div class="top__contacts">' +
'        [% contacts %]' +
'    </div>' +
'</div>'); 
/*- @ desktop/top/top.jn.html -*/
/*- desktop/top/top.jn.js @ -*/
jn.create('top', function () {
    return jn.exec('top__layout', {
        imgSrc: './desktop/top/assets/top__photo.jpg',
        contacts: jn.exec('contacts')
    });
});
 
/*- @ desktop/top/top.jn.js -*/
/*- desktop/menu/menu.jn.html @ -*/

jn.create('menu',
'<div class="menu">' +
'    <div class="menu__item menu__item_selected_yes" data-menu="work-list">[% lang:menu.work_list %]</div>' +
'    <div class="menu__item" data-menu="edu-list">[% lang:menu.edu_list %]</div>' +
'    <div class="menu__item" data-menu="about-techs">[% lang:menu.about_techs %]</div>' +
'    <div class="menu__item" data-menu="about-me">[% lang:menu.about_me %]</div>' +
'</div>'); 
/*- @ desktop/menu/menu.jn.html -*/
/*- desktop/menu/menu.js @ -*/
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
/*- @ desktop/menu/menu.js -*/
/*- desktop/timeline/timeline.jn.html @ -*/

jn.create('timeline',
'<div class="timeline [% cls %]">' +
'    <div class="timeline__part">' +
'        <div class="timeline__left">' +
'            [% left %]' +
'        </div>' +
'        <div class="timeline__right">' +
'            [% right %]' +
'        </div>' +
'    </div>' +
'</div>');
jn.create('timeline__date',
'<div class="timeline__date">[% date %]</div>');
jn.create('timeline__desc',
'<div class="timeline__desc">' +
'    <div class="timeline__label">[% label %]</div>' +
'    <div class="timeline__position">[% position %]</div>' +
'    <div>[% desc %]</div>' +
'</div>'); 
/*- @ desktop/timeline/timeline.jn.html -*/
/*- desktop/footer/footer.jn.html @ -*/

jn.create('footer',
'<div class="footer">' +
'    <div class="footer__content">' +
'        [% content %]' +
'    </div>' +
'</div>'); 
/*- @ desktop/footer/footer.jn.html -*/
/*- desktop/work-list/work-list.jn.html @ -*/
 
/*- @ desktop/work-list/work-list.jn.html -*/
/*- desktop/work-list/work-list.jn.js @ -*/
jn.create('work-list', function() {
    var result = [],
        TOTAL_COUNT = 3,
        cls, left, right, tmp;

    for (var i = 0; i < TOTAL_COUNT; i++) {
        cls = (i === 0 ? 'timeline_first' : '');
        cls = (i === TOTAL_COUNT - 1 ? 'timeline_last' : cls);

        left = jn.exec('timeline__date', {
            date: '[% lang:work.' + i + '.date %]'
        });

        right = jn.exec('timeline__desc', {
            label: '[% lang:work.' + i + '.label %]',
            position: '[% lang:work.' + i + '.position %]',
            desc: '[% lang:work.' + i + '.desc %]'
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

    return jn.exec('div', {
        cls: 'work-list',
        content: result.join('') +
            jn.exec('footer', {
                content: '[% lang:work.footer %]'
            })
    });
});
 
/*- @ desktop/work-list/work-list.jn.js -*/
/*- desktop/edu-list/edu-list.jn.html @ -*/
 
/*- @ desktop/edu-list/edu-list.jn.html -*/
/*- desktop/edu-list/edu-list.jn.js @ -*/
jn.create('edu-list', function() {
    var result = [],
        TOTAL_COUNT = 3,
        cls, left, right, tmp;

    for (var i = 0; i < TOTAL_COUNT; i++) {
        cls = (i === 0 ? 'timeline_first' : '');
        cls = (i === TOTAL_COUNT - 1 ? 'timeline_last' : cls);

        left = jn.exec('timeline__date', {
            date: '[% lang:edu.' + i + '.date %]'
        });

        right = jn.exec('timeline__desc', {
            label: '[% lang:edu.' + i + '.label %]',
            position: '[% lang:edu.' + i + '.position %]',
            desc: '[% lang:edu.' + i + '.desc %]'
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

    return jn.exec('div', {
        cls: 'edu-list',
        content: result.join('') +
            jn.exec('footer', {
                content: '[% lang:edu.footer %]'
            })
    });
});
 
/*- @ desktop/edu-list/edu-list.jn.js -*/
/*- desktop/document/document.jn.html @ -*/

jn.create('document',
'<!DOCTYPE html>' +
'<html class="js__support_no js__good_no flex__support_no">' +
'<head>' +
'	<title>[% lang:page.title %]</title>' +
'    <meta charset="utf-8">' +
'    [% inline__js-detector %]' +
'    [% inline__css-reset %]' +
'    <link rel="stylesheet" href="./index.css">' +
'    [% inline__js-lib %]' +
'    <script type="text/javascript" src="./desktop/menu/menu.js"></script>' +
'</head>' +
'<body class="body_page_work-list">' +
'    [% paranja %]' +
'    <div class="content">' +
'        <div class="content__center">' +
'            [% top %]' +
'            [% menu %]' +
'            [% work-list %]' +
'            [% edu-list %]' +
'            [% about-techs %]' +
'            [% about-me %]' +
'        </div>' +
'    </div>' +
'</body>' +
'</html>'); 
/*- @ desktop/document/document.jn.html -*/
/*- desktop/double-box/double-box.jn.html @ -*/

jn.create('double-box',
'<div class="double-box">' +
'    <div class="double-box__left">' +
'        [% left %]' +
'    </div>' +
'    <div class="double-box__right">' +
'        <div class="double-box__gap"></div>' +
'        [% right %]' +
'    </div>' +
'</div>'); 
/*- @ desktop/double-box/double-box.jn.html -*/
/*- desktop/history/history.jn.html @ -*/
 
/*- @ desktop/history/history.jn.html -*/
/*- desktop/history/history.jn.js @ -*/
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
 
/*- @ desktop/history/history.jn.js -*/
/*- desktop/text/text.jn.html @ -*/

jn.create('text',
'<div class="text">' +
'    [% text %]' +
'</div>'); 
/*- @ desktop/text/text.jn.html -*/
