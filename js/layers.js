addLayer("stone", {
    name: "Stone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#777777",
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
        if (hasUpgrade('stone', 32)) mult = mult.times(2)
        if (hasUpgrade('stone', 43)) mult = mult.times(upgradeEffect('stone', 43))
        mult = mult.times(buyableEffect('stone', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for stone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
            title: "Point Doubler",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Point Tripler",
            description: "Triple your point gain.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade('stone', 11); },
        },
        13: {
            title: "Stone-Point Catalyst",
            description: "Boost your point gain based on stone.",
            effect() {
                if (hasUpgrade('stone', 23)) return player[this.layer].points.add(1).pow(0.45);
                return player[this.layer].points.add(1).pow(0.3);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(8),
            tooltip() {
                if (hasUpgrade('stone', 23)) return "The Catalyst is at 45% efficiency.";
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
                let baseEffect = player[this.layer].upgrades.length;
                if (hasUpgrade('stone', 44)) {
                    return new Decimal(baseEffect).pow(2);
                }
                return new Decimal(baseEffect);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
            },
            cost: new Decimal(50),
            unlocked() { 
                return hasUpgrade('stone', 14); 
            },
        },        
        21: {
            title: "Exponential Points",
            description: "Boost points by themselves.",
            effect() {
                return player.points.add(1).pow(0.15);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(140),

            unlocked() { return hasUpgrade('stone', 15); },
        },
        22: {
            title: "Point Quadrupler",
            description: "Quadruple your point gain.",
            cost: new Decimal(300),
            unlocked() { return hasUpgrade('stone', 21); },
        },
        23: {
            title: "Reinforced Catalyst",
            description: "Increase the catalyst's efficiency by 15%.",
            cost: new Decimal(800),
            unlocked() { return hasUpgrade('stone', 22); },
        },
        24: {
            title: "Reinforced Foundation",
            description: "Add 3 to base point gain (5 total).",
            cost: new Decimal(2500),
            unlocked() { return hasUpgrade('stone', 23); },
        },
        25: {
            title: "New Frontiers",
            description: "Unlock the Buyables tab.",
            cost: new Decimal(6000),
            unlocked() { return hasUpgrade('stone', 24); },
        },
        31: {
            title: "Finally, Boosting Stone!",
            description: "Triple stone gain.",
            cost: new Decimal(50000),
            unlocked() { return hasUpgrade('stone', 25); },
        },
        32: {
            title: "Double Trouble",
            description: "Double stone and point gain.",
            cost: new Decimal(750000),
            unlocked() { return hasUpgrade('stone', 31); },
        },
        33: {
            title: "Anotha One",
            description: "Unlock another buyable.",
            cost: new Decimal(10000000),
            unlocked() { return hasUpgrade('stone', 32); },
        },
        34: {
            title: "Reinforced Amplifiers",
            description: "Make buyables stronger.",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade('stone', 33); },
        },
        35: {
            title: "Affordable Amplifiers",
            description: "Make buyables cheaper.",
            cost: new Decimal(1e11),
            unlocked() { return hasUpgrade('stone', 34); },
        },
        41: {
            title: "Wacky Warehouses",
            description: "Unlock another buyable.",
            cost: new Decimal(2.5e16),
            unlocked() { return hasUpgrade('stone', 35); },
        },
        42: {
            title: "Point Quintupler",
            description: "Quintuple your point gain.",
            cost: new Decimal(1e21),
            unlocked() { return hasUpgrade('stone', 41); },
        },
        43: {
            title: "Point-Stone Catalyst",
            description: "Boost your stone gain based on points.",
            effect() {
                return player.points.add(1).pow(0.05);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(1e23),
            tooltip() {
                return "The Catalyst is at 50% efficiency.";
            },
            unlocked() { return hasUpgrade('stone', 42); },
        },
        44: {
            title: "Reinforced Processor",
            description: "The upgrade processor's effect is squared.",
            cost: new Decimal(1e31),
            unlocked() { return hasUpgrade('stone', 43); },
        },
        45: {
            title: "In The Name",
            description: "Finally unlock your first ore: Coal.",
            cost: new Decimal(1e35),
            unlocked() { return hasUpgrade('stone', 44); },
        },
    },
    buyables: {
        11: {
            title: "Point Amplifier",
            cost(x) { 
                if (hasUpgrade('stone', 35)) return new Decimal(1.5).pow(x).mul(12.5);
                else return new Decimal(1.5).pow(x).mul(250);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.25).pow(amount);
                if (hasUpgrade('stone', 34)) multiplier = new Decimal(1.275).pow(amount);
                
                // Dynamically calculate the purchase limit based on warehouses
                let maxLimit = new Decimal(75).add(buyableEffect('stone', 13));
                return `Multiply your point gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(75).add(buyableEffect('stone', 13)); // Dynamic limit
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id).add(1))) 
                    && getBuyableAmount(this.layer, this.id).lt(maxLimit);
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id).add(1));
                player[this.layer].points = player[this.layer].points.sub(cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                if (hasUpgrade('stone', 34)) return new Decimal(1.275).pow(amount);
                else return new Decimal(1.25).pow(amount);
            },
            unlocked() {
                return hasUpgrade(this.layer, 25);
            }
        },
        12: {
            title: "Stone Amplifier",
            cost(x) { 
                if (hasUpgrade('stone', 35)) return new Decimal(1.75).pow(x).mul(1250);
                return new Decimal(1.75).pow(x).mul(25000);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.15).pow(amount);
                if (hasUpgrade('stone', 34)) multiplier = new Decimal(1.19).pow(amount);
                
                // Dynamically calculate the purchase limit based on warehouses
                let maxLimit = new Decimal(50).add(buyableEffect('stone', 13));
                return `Multiply your stone gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(50).add(buyableEffect('stone', 13)); // Dynamic limit
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id).add(1))) 
                    && getBuyableAmount(this.layer, this.id).lt(maxLimit);
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id).add(1));
                player[this.layer].points = player[this.layer].points.sub(cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                if (hasUpgrade('stone', 34)) return new Decimal(1.19).pow(amount);
                else return new Decimal(1.15).pow(amount);
            },
            unlocked() {
                return hasUpgrade('stone', 32);
            },
        },        
        13: {
            title: "Warehouses",
            cost(x) { 
                return new Decimal(1.9).pow(x).mul(5e13);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1).mul(amount);
                return `Purchase a warehouse to store more amplifiers. Increases amplifier limit by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)}`;
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
                return amount;
            },
            unlocked() {
                return hasUpgrade(this.layer, 41);
            }
        },
    },
    layerShown(){return true}
})
addLayer("coal", {
    name: "coal", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#444444",
    requires: new Decimal(1e46), // Can be a function that takes requirement increases into account
    resource: "coal", // Name of prestige currency
    baseResource: "stone", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    spcateff: 0.4,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "c", description: "C: Reset for coal", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "blank", "upgrades"]
        },
        
        "Buyables": {
            content: ["main-display", "prestige-button", "blank", "buyables"],
        },
    },
    layerShown(){return true}
})
