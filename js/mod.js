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
	num: "INDEV",
	name: "In Development",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>vINDEV</h3><br>
		- Under development. <br>`

let winText = `TBD`

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
	let gain = new Decimal(0.1)
	if (hasUpgrade("coal", 11)) gain = new Decimal(3)
	if (hasUpgrade("stone", 13)) gain = gain.add(0.1)
	if (hasUpgrade("stone", 24)) gain = gain.add(0.3)
	if (hasUpgrade("stone", 34)) gain = gain.add(0.5)
	if (hasUpgrade("stone", 53)) gain = gain.add(12)
	gain = gain.add(buyableEffect('stone', 22))

	if (hasUpgrade("stone", 11)) gain = gain.times(1.5)
	if (hasUpgrade("stone", 12)) gain = gain.times(2)
	if (hasUpgrade("stone", 14)) gain = gain.times(upgradeEffect("stone", 14))
	if (hasUpgrade("stone", 15)) gain = gain.times(upgradeEffect("stone", 15))
	if (hasUpgrade("stone", 21)) gain = gain.times(upgradeEffect("stone", 21))
	if (hasUpgrade("stone", 22)) gain = gain.times(3)
	gain = gain.times(buyableEffect('stone', 11))
	if (hasUpgrade("stone", 32)) gain = gain.times(4)
	if (hasUpgrade("stone", 33)) gain = gain.times(2)
	if (hasUpgrade('stone', 45) & hasAchievement("a", 22)) gain = gain.times(2)
	if (hasUpgrade("coal", 12)) gain = gain.times(3)
	if (hasUpgrade("coal", 14)) gain = gain.times(upgradeEffect("coal", 14))
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
	return player.points.gte(new Decimal("e280000000")) // To be determined
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