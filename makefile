JN_REPO = https://github.com/ViktorKad/jn.git
JN_NPM = node_modules/jn/bin/jn

.PHONY: all clean init public

all: desktop mobile
	rm -rf ./build

	node $(JN_NPM) --makestyl
	node $(JN_NPM) --makecode

	cp ./build/common-desktop/index.ru.html ./index.html
	cp ./build/common-desktop/all.css ./index.css

	cp ./build/common-mobile/index.ru.html ./m.index.html
	cp ./build/common-mobile/all.css ./m.index.css

init:
	@if [ ! -d "node_modules/jn" ]; then npm install $(JN_REPO); fi

clean:
	rm -rf ./*/*/.*.jn.css
	rm -rf ./build
	rm -rf ./index.html
	rm -rf ./index.css
	rm -rf ./m.index.html
	rm -rf ./m.index.css

public:
	git checkout gh-pages
	git pull
	git merge master --no-edit
	make init
	make
	git add .
	git commit -m "Make public done"
	git push origin gh-pages
	make clean
	make checkout master
