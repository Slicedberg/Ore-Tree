let modInfo = {
	name: "The Ore Tree",
	author: "Slicedberg",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.01X",
	name: "InDev",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- I'm not writing a changelog for indev.<br>
		- Game has 3 layers, currently unbalanced.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(1)
	if (hasUpgrade('stone', 14)) gain = gain.add(1)
	if (hasUpgrade('stone', 24)) gain = gain.add(3)
	gain = gain.add(buyableEffect('stone', 22))
	if (hasUpgrade('stone', 11)) gain = gain.times(2)
	if (hasUpgrade('stone', 12)) gain = gain.times(3)
	if (hasUpgrade('stone', 13)) gain = gain.times(upgradeEffect('stone', 13))
	if (hasUpgrade('stone', 15)) gain = gain.times(upgradeEffect('stone', 15))
	if (hasUpgrade('stone', 21)) gain = gain.times(4)
	if (hasUpgrade('stone', 22)) gain = gain.times(upgradeEffect('stone', 22))
	gain = gain.times(buyableEffect('stone', 11))
	if (hasUpgrade('stone', 31)) gain = gain.times(5)
	if (hasUpgrade('stone', 33)) gain = gain.times(2)
	if (hasUpgrade('coal', 11)) gain = gain.times(6)
	if (hasUpgrade('coal', 12)) gain = gain.times(3)
	if (hasUpgrade('coal', 15)) gain = gain.times(upgradeEffect('coal', 15))
	if (hasUpgrade('refinery', 11)) gain = gain.times(2)
	if (hasUpgrade('stone', 55)) gain = gain.times(upgradeEffect('stone', 55))
	gain = gain.times(buyableEffect('refinery', 11))
	if (hasUpgrade('coal', 21) && !hasUpgrade("coal", 34)) gain = gain.times(0.5)
	if (hasUpgrade('coal', 22)) gain = gain.times(3)
	if (hasUpgrade('coal', 23)) gain = gain.times(3)
	if (hasUpgrade('coal', 24)) gain = gain.times(3)
	if (hasUpgrade('coal', 33)) gain = gain.times(4)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade("coal", 35)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}