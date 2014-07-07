.PHONY: install start lint-error-check

install:
	pip install $$(cat pip.txt)

lint-error-check:
	for file in `find . -name '*.py' -type f`; do \
		echo "error-checking $$file"; \
		pylint -E $$file; \
	done

start:
	if [ -f /tmp/jobapp.db ]; then \
		rm -rf /tmp/jobapp.db; \
	fi
	./runjobapp.py --init-db
