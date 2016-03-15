TESTS_FOLDER := ./bin/test/

BIN_MOCHA := ./node_modules/.bin/mocha

REPORTER := spec

test:
	@NODE_ENV=test \
	$(BIN_MOCHA) \
	--reporter $(REPORTER) \
	--timeout 10000 \
	--slow 2000 \
	$(TESTS_FOLDER)

test-watch:
	@NODE_ENV=test \
	$(BIN_MOCHA) \
	--reporter $(REPORTER) \
	--timeout 10000 \
	--slow 2000 \
	--watch \
	$(TESTS_FOLDER)

.PHONY: test, test-watch