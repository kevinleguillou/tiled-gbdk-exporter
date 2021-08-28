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

const tileSize = 8
const palette = []

// We use this bruteforce approach to avoid counting unused colors in colorTable()
// (happens when exporting PNGs when using indexed colors in Aseprite)
const computePalette = (image) => {
	for(let y = 0; y < image.height; y++){
		for(let x = 0; x < image.height; x++){
			const currentColor = image.pixel(x, y)
			if(!palette.find(color => color === currentColor)){
				palette.push(currentColor)
			}
		}
	}
	// Sort colors by inverse value (lighter colors first)
	palette.sort((a, b) => (b - a))
}

const getLineAsEncodedHex = (startX, startY, image) => {
	let byteArray = Array(new String, new String)

	const width = tileSize
	for (let x = 0; x < width; x++) {
		const pixelValue = palette.indexOf(image.pixel(startX + x, startY))
		switch(pixelValue){
			default:
			case 0:
				byteArray[0] = byteArray[0].concat(0)
				byteArray[1] = byteArray[1].concat(0)
				break;
			case 1:
				byteArray[0] = byteArray[0].concat(1)
				byteArray[1] = byteArray[1].concat(0)
				break;
			case 2:
				byteArray[0] = byteArray[0].concat(0)
				byteArray[1] = byteArray[1].concat(1)
				break;
			case 3:
				byteArray[0] = byteArray[0].concat(1)
				byteArray[1] = byteArray[1].concat(1)
				break;
		}
	}

	byteArray[0] = "0x" + parseInt(byteArray[0], 2).toString(16)
	byteArray[1] = "0x" + parseInt(byteArray[1], 2).toString(16)

	return byteArray
}

// Reads a 8x8 tile and encodes the pixel data in hex
const getEncodedTile = (tileX, tileY, image) => {
	let encodedTile = Array()

	const height = tileY + tileSize
	for(let y = tileY; y < height; y++){
		encodedTile.push(...getLineAsEncodedHex(tileX, y, image))
	}

	return encodedTile
}

const writeTileset = (tileset, filename) => {
	const image = new Image(tileset.image)
	computePalette(image)

	// Isolate each 8x8 tile and convert to the hex encoded version
	let tileArray = Array();
	for (let y = 0; y < image.height; y += tileSize) {
		for (let x = 0; x < image.width; x += tileSize) {
			tileArray.push(getEncodedTile(x, y, image))
		}
	}
	
	// Print each tile on a single line with a bit of formatting
	let tilesetContent = ""
	tileArray.forEach((tile, index) => {
		tilesetContent += tile.join(", ")
		if(index < tileArray.length - 1) tilesetContent += ",\n    "
	})

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
	const sourceContent = getSourceContent(tilesetContent, fileBaseName)
	sourceFile.write(sourceContent)
	sourceFile.commit()
}

const gbTilesetFromat = {
	name: "GBDK Tileset format",
	extension: "c",
	write: writeTileset
}

tiled.registerTilesetFormat("gb", gbTilesetFromat)