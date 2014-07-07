.PHONY: install

install:
	pip install $$(cat pip.txt)

start:
	if [ -f /tmp/jobapp.db ]; then \
		rm -rf /tmp/jobapp.db; \
	fi
	./runjobapp.py --init-db
