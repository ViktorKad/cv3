all: *
	rm -rf ./build
	node node_modules/jn/bin/jn --makestyl
	node node_modules/jn/bin/jn --makecode

	cp ./build/common-desktop/index.ru.html ./index.html
	cp ./build/common-desktop/all.css ./index.css

	cp ./build/common-mobile/index.ru.html ./m.index.html
	cp ./build/common-mobile/all.css ./m.index.css

init:
	npm uninstall jn
	npm install https://github.com/ViktorKad/jn.git
