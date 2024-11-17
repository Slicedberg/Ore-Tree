addLayer("stone", {
    name: "Stone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#666666",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "stone", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    spcateff: 0.4,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('stone', 31)) mult = mult.times(3)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "prestige-button", "blank", "upgrades"]
        },
        "Buyables": {
            content: ["main-display", "prestige-button", "blank", "buyables"]
        },
    },
    upgrades: {
        11: {
            title: "Stone Doubler",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Stone Tripler",
            description: "Triple your point gain.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade('stone', 11); },
        },
        13: {
            title: "Stone-Point Catalyst",
            description: "Boost your point gain based on stone.",
            effect() {
                if (hasUpgrade('stone', 23)) return player[this.layer].points.add(1).pow(0.40);
                return player[this.layer].points.add(1).pow(0.3);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(8),
            tooltip() {
                if (hasUpgrade('stone', 23)) return "The Catalyst is at 40% efficiency.";
                return "The Catalyst is at 30% efficiency.";
            },
            unlocked() { return hasUpgrade('stone', 12); },
        },
        14: {
            title: "Stone Foundation",
            description: "Add one to base point gain.",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade('stone', 13); },
        },
        15: {
            title: "Upgrade Processor",
            description: "Multiply point gain by stone upgrades purchased.",
            effect() {
                return player[this.layer].upgrades.length;
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(50),
            unlocked() { return hasUpgrade('stone', 14); },
        },
        21: {
            title: "Exponential Points",
            description: "Boost points by themselves.",
            effect() {
                return player.points.add(1).pow(0.1);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(160),

            unlocked() { return hasUpgrade('stone', 15); },
        },
        22: {
            title: "Stone Quadrupler",
            description: "Quadruple your point gain.",
            cost: new Decimal(400),
            unlocked() { return hasUpgrade('stone', 21); },
        },
        23: {
            title: "Reinforced Catalyst",
            description: "Increase the catalyst's efficiency by 10%.",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade('stone', 22); },
        },
        24: {
            title: "Reinforced Foundation",
            description: "Add 3 to base point gain (5 total).",
            cost: new Decimal(4500),
            unlocked() { return hasUpgrade('stone', 23); },
        },
        25: {
            title: "New Frontiers",
            description: "Unlock Stone Buyables.",
            cost: new Decimal(12000),
            unlocked() { return hasUpgrade('stone', 24); },
        },
        31: {
            title: "Finally, Buffing Stone!",
            description: "Triple stone gain.",
            cost: new Decimal(12000),
            unlocked() { return hasUpgrade('stone', 25); },
        },
    },
    buyables: {
        11: {
            title: "Point Amplifier",
            cost(x) { 
                return new Decimal(1000).mul(x).pow(1.15);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.5).pow(amount);
                return `Multiply your point gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amoubt: ${getBuyableAmount(this.layer, this.id)}`;
            },
            canAfford() { 
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id).add(1))); 
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id).add(1));
                player[this.layer].points = player[this.layer].points.sub(cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                return new Decimal(2).pow(amount);
            },
            unlocked() {
                return hasUpgrade(this.layer, 12);
            }
        }
    },
    layerShown(){return true}
})
