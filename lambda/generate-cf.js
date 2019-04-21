/*
 * Inline source code of lambda in CloudFormation
 */

const fs = require('fs');

const INDENT = '          ';
const lambdaCode = fs.readFileSync('index.js', {encoding: 'utf-8'});
const cf = fs.readFileSync('cf.template.yaml', {encoding: 'utf-8'});

const yamlFormattedCode = `>\n${INDENT}` + lambdaCode.replace(/\n/g, `\n${INDENT}`);
fs.writeFileSync('cf.yaml', cf.replace('__CODE__', yamlFormattedCode));