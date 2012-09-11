#! /bin/sh

# Set here the path to the jsdoc toolkit script and template dir
jsdocPath="node_modules/jsdoc-toolkit/app/run.js"
templatePath="node_modules/jsdoc-toolkit/templates/jsdoc/"

# This script uses the node version of jsdoc-toolkit, you can install it with
# npm install jsdoc-toolkit

$jsdocPath src/Rules.js -t=$templatePath -d="doc"
