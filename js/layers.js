addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    tabFormat: {
        "Achievements": { 
            content: [ 
            ["display-text", function() { return "Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
            "blank", "blank",
            "achievements", ]
        },
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Your first Achievement",
            done() {return hasUpgrade('stone', 11)},
            unlocked() {return true},
            tooltip: "Buy the first upgrade",
            onComplete() {}
        },  
        12: {
            name: "Double Digits",
            done() {return player.points.gte(10)},
            unlocked() {return true},
            tooltip: "Have 10 points",
            onComplete() {}
        },
        13: {
            name: "Infinite Upgrades",
            done() {return hasUpgrade('stone', 25)},
            unlocked() {return true},
            tooltip: "Unlock buyables, which can be bought multiple times",
            onComplete() {}
        },
        14: {
            name: "Long Wait",
            done() {return hasUpgrade('stone', 31)},
            unlocked() {return true},
            tooltip: "Boost stone gain (Stone Upgrade 31)",
            onComplete() {}
        },
        15: {
            name: "Buy One Get One Free",
            done() {return hasUpgrade('stone', 34)},
            unlocked() {return true},
            tooltip: "Buy an upgrade that both boosts and unlocks.",
            onComplete() {}
        },
        16: {
            name: "Richest Person Alive",
            done() {return player.points.gte(324000000000)},
            unlocked() {return true},
            tooltip: "Have more points than Elon Musk",
            onComplete() {}
        },
    },
    layerShown(){return true}
},
),
addLayer("stone", {
    name: "stone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#888888",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "stone", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("stone", 31)) mult = mult.times(2)
        if (hasUpgrade("stone", 33)) mult = mult.times(2)
        mult = mult.times(buyableEffect('stone', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "blank", "upgrades"]
        },
        
        "Buyables": {
            content: ["main-display", "prestige-button", "blank", "buyables"],
            unlocked() {return hasUpgrade('stone', 25)},
        },
    },
    upgrades: {
        11: {
            title: "Better Points",
            description: "Multiply point generation by 1.5",
            cost: new Decimal(1),
            unlocked() {return true}
        },
        12: {
            title: "Point Doubler",
            description: "Multiply point generation by 2",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade('stone', 11)}
        },
        13: {
            title: "Point Foundation",
            description: "Add 0.1 to base point gain",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade('stone', 12)}
        },
        14: {
            title: "Stone-Point Catalyst",
            description: "Stone boosts point gain",
            cost: new Decimal(12),
            effect() {
                if (hasUpgrade("stone", 23)) return player[this.layer].points.add(1).pow(0.370);
                else return player[this.layer].points.add(1).pow(0.222)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
            tooltip() {
                if (hasUpgrade('stone', 23)) return "This Catalyst is at 100% efficiency.";
                return "The Catalyst is at 60% efficiency.";
            },
            unlocked() {return hasUpgrade('stone', 13)}
        },
        15: {
            title: "Upgrade Processor",
            description: "Purchased stone upgrades boost point gain",
            effect() {
                return new Decimal(player[this.layer].upgrades.length).pow(0.5)},
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"},
            cost: new Decimal(25),
            unlocked() { return hasUpgrade('stone', 14)},
        },
        21: {
            title: "Exponential Points",
            description: "Points boost themselves",
            effect() {
                return player.points.pow(0.111).add(1)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"},
            cost: new Decimal(50),
            unlocked() { return hasUpgrade('stone', 15)},
        },
        22: {
            title: "Point Tripler",
            description: "Multiply point generation by 3",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('stone', 21)},
        },
        23: {
            title: "Reinforced Catalyst",
            description: "The Catalyst's efficiency is now 100%",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade('stone', 22); },
        },
        24: {
            title: "Reinforced Foundation",
            description: "Add 0.3 to base point gain (0.5 total).",
            cost: new Decimal(400),
            unlocked() { return hasUpgrade('stone', 23); },
        },
        25: {
            title: "New Frontiers",
            description: "Unlock the Buyables tab.",
            cost: new Decimal(700),
            unlocked() { return hasUpgrade('stone', 24); },
        },
        31: {
            title: "Finally, Boosting Stone!",
            description: "Multiply stone gain by 2",
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade('stone', 25); },
        },
        32: {
            title: "Point Quadrupler",
            description: "Multiply point generation by 4",
            cost: new Decimal(16000),
            unlocked() { return hasUpgrade('stone', 31); },
        },
        33: {
            title: "Double Trouble",
            description: "Multiply point and stone gain by 2",
            cost: new Decimal(50000),
            unlocked() { return hasUpgrade('stone', 32); },
        },
        34: {
            title: "Two in One",
            description: "Unlock another buyable, and base point gain is 1",
            cost: new Decimal(400000),
            unlocked() { return hasUpgrade('stone', 33); },
        },
        35: {
            title: "Reinforced Buyables",
            description: "Increase buyable effect scaling.",
            cost: new Decimal(1500000),
            unlocked() { return hasUpgrade('stone', 34); },
        },
    },

    buyables: {
        11: {
            title: "Point Amplifier",
            cost(x) { 
                return new Decimal(1.325).pow(x).mul(50);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.25).pow(amount);
                if (hasUpgrade('stone', 35)) multiplier = new Decimal(1.275).pow(amount);
                let maxLimit = new Decimal(100);
                return `Multiply your point gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(100); // Dynamic limit
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) 
                    && getBuyableAmount(this.layer, this.id).lt(maxLimit);
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id));
                player[this.layer].points = player[this.layer].points.sub(cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                if (hasUpgrade('stone', 35)) return new Decimal(1.275).pow(amount);
                else return new Decimal(1.25).pow(amount);

            },
            tooltip() { 
                if (hasUpgrade('stone', 35)) return ('Base Cost: 50 <br> Cost Scaling: 1.325 <br> Effect Scaling: 1.275')
                else return ('Base Cost: 50 <br> Cost Scaling: 1.325 <br> Effect Scaling: 1.25')
            },
            unlocked() {
                return hasUpgrade(this.layer, 25);
            },
        },
        12: {
            title: "Stone Amplifier",
            cost(x) { 
                return new Decimal(1.4).pow(x).mul(100000);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.15).pow(amount);
                if (hasUpgrade('stone', 35)) multiplier = new Decimal(1.18).pow(amount);
                let maxLimit = new Decimal(50);
                return `Multiply your stone gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(50); // Dynamic limit
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) 
                    && getBuyableAmount(this.layer, this.id).lt(maxLimit);
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id));
                player[this.layer].points = player[this.layer].points.sub(cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                if (hasUpgrade('stone', 35)) return new Decimal(1.18).pow(amount);
                else return new Decimal(1.15).pow(amount);
            },
            tooltip() { 
                if (hasUpgrade('stone', 35)) return ('Base Cost: 100000 <br> Cost Scaling: 1.4 <br> Effect Scaling: 1.18')
                else return ('Base Cost: 100000 <br> Cost Scaling: 1.4 <br> Effect Scaling: 1.15')
            },
            unlocked() {
                return hasUpgrade(this.layer, 34);
            },
        },
    },

    hotkeys: [
        {key: "s", description: "S: Reset for stone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
