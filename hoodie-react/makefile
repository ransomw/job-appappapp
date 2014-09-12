.PHONY: start install

start:
	node node_modules/hoodie-server/bin/start

install:
	npm install
	npm -g install bower
	(cd www && bower install)
	npm install -g jslint

lint:
	jslint $$(find www/js -name '*.js')