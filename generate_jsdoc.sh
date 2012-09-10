#! /bin/sh

#java -jar jsrun.jar app/run.js -c=conf.js

#node doc/jsdoc/app/run.js -c=doc/conf.js

node_modules/jsdoc-toolkit/app/run.js src/Rules.js -t=node_modules/jsdoc-toolkit/templates/jsdoc/ -d="doc"
