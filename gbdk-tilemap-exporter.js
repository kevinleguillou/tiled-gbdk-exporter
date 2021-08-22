const getHeaderContent = (mapName) => {
	return `extern unsigned char ${mapName}[];`
}

const getSourceContent = (content, mapName) => {
	let fileContent = ""
	fileContent += `#define ${mapName} ${mapName}\n`
	fileContent += `const unsigned char ${mapName}[] = {\n`
	fileContent += `    ${content}\n`
	fileContent += `};`
	return fileContent
}

const toHex = (value) => {
	return `0x${value.toString(16)}`
}

const writeMap = (tilemap, filename) => {
	// Go through each tile and append the tile ID to the C array
	let tileArray = "";
	for (let layerIndex = 0; layerIndex < tilemap.layerCount; layerIndex++) {
		currentLayer = tilemap.layerAt(layerIndex);
		for (let y = 0; y < currentLayer.height; y++) {
			for (let x = 0; x < currentLayer.width; x++) {
				tileArray = tileArray.concat(toHex(currentLayer.tileAt(x, y).id))
				if (x != currentLayer.width - 1 || y != currentLayer.height - 1){
					tileArray = tileArray.concat(", ")
				}
			}
		}
	}
	
	// Split full filename path into the filename (without extension) and the directory
	const fileBaseName = FileInfo.completeBaseName(filename).replace(/[^a-zA-Z0-9_]/g, "_")
	const filePath = FileInfo.path(filename) + "/"

	// Write the C header file
	const headerFile = new TextFile(filePath + fileBaseName + ".h", TextFile.WriteOnly)
	const headerContent = getHeaderContent(fileBaseName)
	headerFile.write(headerContent)
	headerFile.commit()
	
	// Write the C file, merge with the array content
	const sourceFile = new TextFile(filePath + fileBaseName + ".c", TextFile.WriteOnly)
	const sourceContent = getSourceContent(tileArray, fileBaseName)
	sourceFile.write(sourceContent)
	sourceFile.commit()
}

const gbMapFormat = {
	name: "GBDK Map format",
	extension: "c",
	write: writeMap
}

tiled.registerMapFormat("gb", gbMapFormat)