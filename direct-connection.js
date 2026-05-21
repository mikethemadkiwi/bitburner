/** @param {NS} ns */
export async function main(ns) {
	// Three steps in this process. 

	// 1.Map the servers in levels, stored in a matrix, with each server object containing a pointer to the previous level server its connected to. 
	// 2. Then navigate the matrix to build out all the required aliases. 
	// 3. Finally, run the alias command. 

	// The steps are marked by the three main functions at the end.

	// Work around the RAM cost of document
	const doc = eval('document');
	// Acquire a reference to the terminal text field
	const terminalInput = doc.getElementById("terminal-input");
	// Get a reference to the React event handler.
	const handler = Object.keys(terminalInput)[1];
	//Create an enter press
	const enterPress = new KeyboardEvent('keydown',
		{
			bubbles: true,
			cancelable: true,
			keyCode: 13
		});

	// Holds terminal command for building the alias
	let aliasString = '';
	const serverMatrix = []
	// Home node must be backdoored elsewise the direct connections won't work	
	let homeNode = 'home'
	// Quick object to check for duplicates as the network is mapped
	const isInServerMatrix = {
		'home': true
	}

	// Function for step 1
	function mapServers() {
		const firstLayer = []
		const homeScan = ns.scan(homeNode)

		class Server {
			constructor(name, parentCoordinates) {
				this.name = name
				// Pointer to previous server on the way to home
				this.parentCoordinates = parentCoordinates
			}
		}

		// Create first layer of servers
		for (let server of homeScan) {
			firstLayer.push(new Server(server, homeNode))
		}

		serverMatrix.push(firstLayer)

		// Loops that build out the matrix
		for (let i = 0; i < serverMatrix.length; i++) {
			for (let j = 0; j < serverMatrix[i].length; j++) {
				if (!serverMatrix[i + 1]) {
					serverMatrix.push([])
				}

				// Add new connected servers for mapping, make sure there are no dupes, and add them into the matrix with
				const serverList = ns.scan(serverMatrix[i][j].name)

				for (let server of serverList) {
					if (isInServerMatrix[server]) {
						// ns.tprint(`Skipped server ${server} because it was found in our tracker obj`)
						// ns.tprint(`${isInServerMatrix[server]}`)
						continue	
					}

					serverMatrix[i + 1].push(new Server(server, [i, j]))
					isInServerMatrix[server] = true
				}
			}
		}
		// Removes final empty array from the matrix
		serverMatrix.pop()
		ns.write('server_graph.txt', JSON.stringify(serverMatrix), 'w')
	}

	//===============================================================================================

	// Recursive function that builds out a path by following each servers pointers to its parent
	function pathBuilder(path, coordinates) {
		if (coordinates === homeNode) {
			path.push(homeNode)
			return path
		}

		let nextStep = serverMatrix[coordinates[0]][coordinates[1]]
		let parentCoordinates = nextStep.parentCoordinates
		path.push(nextStep.name)

		if (parentCoordinates === homeNode) {
			path.push(homeNode)
			return path
		}
		return pathBuilder(path, nextStep.parentCoordinates)
	}

	async function generateAliasString() {

		ns.write('test_paths.txt', '', 'w')
		for (let i = serverMatrix.length - 1; i >= 0; i--) {
			for (let j = 0; j < serverMatrix[i].length; j++) {
				let target = serverMatrix[i][j].name
				let aliasName = ''
				let path = pathBuilder([target], serverMatrix[i][j].parentCoordinates)
				let pathString = ''


				for (let a = path.length - 1; a >= 0; a--) {
					if (path[a] !== homeNode) {
						pathString += `connect ${path[a]};`;
					}
				}

				//Sadly '.' isn't usable in the alias so this replaces that
				for (let char of target) {
					if (char === '.') {
						aliasName += 'dot'
					} else {
						aliasName += char
					}
				}

				let homeNodeConnection

				if (homeNode === 'home') {
					homeNodeConnection = 'home'
				} else {
					homeNodeConnection = `connect ${homeNode}`
				}


				ns.tprint(`Created shortest path from home to ${target}`)
				const newAlias = `alias -g c${aliasName.toLowerCase()}="${homeNodeConnection};${pathString}";`
				aliasString += newAlias
				let writeString = `Looking for a path from home to ${target}: ${newAlias}\n`;
				ns.write('test_paths.txt', writeString, 'a')
			}
		}
	}

	//===========================================================================================
	
	// Runs in the terminal whatever string is passed to the function
	function terminalCommand(str) {
		terminalInput.value = str;
		terminalInput[handler].onChange({ target: terminalInput });
		terminalInput.dispatchEvent(enterPress);
	}

	//===============================================================================================

	mapServers()
	generateAliasString()
	terminalCommand(aliasString)
}