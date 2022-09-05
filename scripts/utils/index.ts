import * as fs from 'fs';
var path = require('path');

export const copyFileSync = (source: any, target: any) => {
	var targetFile = target;

	// If target is a directory, a new file with the same name will be created
	if (fs.existsSync(target)) {
		if (fs.lstatSync(target).isDirectory()) {
			targetFile = path.join(target, path.basename(source));
		}
	}

	fs.writeFileSync(targetFile, fs.readFileSync(source));
}

export const copyFolderRecursiveSync = (source: any, target: any) => {
	var files = [];

	// Check if folder needs to be created or integrated
	var targetFolder = path.join(target, path.basename(source));
	console.log('targetFolder', targetFolder);
	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder);
	}

	// Copy
	if (fs.lstatSync(source).isDirectory()) {
		files = fs.readdirSync(source);
		files.forEach(function (file) {
			var curSource = path.join(source, file);
			if (fs.lstatSync(curSource).isDirectory()) {
				copyFolderRecursiveSync(curSource, targetFolder);
			} else {
				copyFileSync(curSource, targetFolder);
			}
		});
	}
}