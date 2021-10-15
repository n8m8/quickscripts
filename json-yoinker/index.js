'use strict';

const fs = require('fs');
var argv = require('yargs/yargs')(process.argv.slice(2)).argv;

const filename = argv.filename;
const fieldToSearch = argv.fieldname;
const distinct = argv.distinct ?? false;


let rawdata = fs.readFileSync(filename);
let parsed = JSON.parse(rawdata);

let _list = [];

searchFieldRecursive(parsed, fieldToSearch);
if (distinct) {
	_list = makeDistinct(_list)

	console.log(`Distinct values of ${fieldToSearch}:`);
	for (let key of Object.keys(_list)) {
		console.log(`${key}: ${_list[key]}`);
	}
} else {
	console.log(`Found all the values of ${fieldToSearch}`);
	for (let item in _list) {
		console.log(item);
	}
}



function searchFieldRecursive(object, fieldName) {
	for (let key in object) {
		if (object[key].constructor == Object) {
			searchFieldRecursive(object[key], fieldName);
		} else if (key === fieldName) {
			_list.push(object[key]);
		}
	}
}

function makeDistinct(list) {
	let distinct = {};

	list.forEach(function(item) {
		if (!Object.keys(distinct).includes(item)) {
			distinct[item] = 1;
		} else {
			distinct[item] = distinct[item] + 1;
		}
	});

	return distinct;
}
