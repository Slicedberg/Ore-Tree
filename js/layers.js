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
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('stone', 32)) mult = mult.times(3)
        if (hasUpgrade('stone', 33)) mult = mult.times(2)
        if (hasUpgrade('stone', 43)) mult = mult.times(upgradeEffect('stone', 43))
        if (hasUpgrade('coal', 12)) mult = mult.times(3)
        if (hasUpgrade('stone', 53)) mult = mult.times(upgradeEffect('stone', 53))
        mult = mult.times(buyableEffect('stone', 12))
        mult = mult.times(buyableEffect('refinery', 12))
        if (hasUpgrade('refinery', 11)) mult = mult.times(2)
        if (hasUpgrade('stone', 55)) mult = mult.times(upgradeEffect('stone', 55))
        if (hasUpgrade('coal', 21)) mult = mult.times(3)
        if (hasUpgrade('coal', 22) && !hasUpgrade("coal", 34)) mult = mult.times(0.5)
        if (hasUpgrade('coal', 23)) mult = mult.times(3)
        if (hasUpgrade('coal', 24)) mult = mult.times(3)
        if (hasUpgrade('coal', 33)) mult = mult.times(4)
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
                if (hasUpgrade('stone', 23)) return "This Catalyst is at 45% efficiency.";
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
            title: "Point Quadrupler",
            description: "Quadruple your point gain.",
            cost: new Decimal(140),
            unlocked() { return hasUpgrade('stone', 15); },
        },     
        22: {
            title: "Exponential Points",
            description: "Boost points by themselves.",
            effect() {
                return player.points.add(1).pow(0.15);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(350),

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
            cost: new Decimal(2000),
            unlocked() { return hasUpgrade('stone', 23); },
        },
        25: {
            title: "New Frontiers",
            description: "Unlock the Buyables tab.",
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade('stone', 24); },
        },
        31: {
            title: "Point Quintupler",
            description: "Quintuple (5x) your point gain.",
            cost: new Decimal(40000),
            unlocked() { return hasUpgrade('stone', 25); },
        },
        32: {
            title: "Finally, Boosting Stone!",
            description: "Triple stone gain.",
            cost: new Decimal(250000),
            unlocked() { return hasUpgrade('stone', 31); },
        },
        33: {
            title: "Double Trouble",
            description: "Double stone and point gain.",
            cost: new Decimal(2000000),
            unlocked() { return hasUpgrade('stone', 32); },
        },
        34: {
            title: "Anotha One",
            description: "Unlock another buyable.",
            cost: new Decimal(75000000),
            unlocked() { return hasUpgrade('stone', 33); },
        },
        35: {
            title: "Reinforced Amplifiers",
            description: "Make buyables stronger.",
            cost: new Decimal(3e9),
            unlocked() { return hasUpgrade('stone', 34); },
        },
        41: {
            title: "Affordable Amplifiers",
            description: "Make buyables cheaper (divide base cost by 20)",
            cost: new Decimal(6e11),
            unlocked() { return hasUpgrade('stone', 35); },
        },
        42: {
            title: "Wacky Warehouses",
            description: "Unlock another buyable.",
            cost: new Decimal(9e16),
            unlocked() { return hasUpgrade('stone', 41); },
        },
        43: {
            title: "Point-Stone Catalyst",
            description: "Boost your stone gain based on points.",
            effect() {
                return player.points.add(1).pow(0.035);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(1e20),
            tooltip() {
                return "This Catalyst is at 50% efficiency.";
            },
            unlocked() { return hasUpgrade('stone', 42); },
        },
        44: {
            title: "Reinforced Processor",
            description: "The upgrade processor's effect is squared.",
            cost: new Decimal(1e25),
            unlocked() { return hasUpgrade('stone', 43); },
        },
        45: {
            title: "In The Name",
            description: "Finally unlock your first Ore: Coal.",
            cost: new Decimal(1e30),
            unlocked() { return hasUpgrade('stone', 44); },
        },
        51: {
            title: "Welcome Back",
            description: "Unlock another buyable.",
            cost: new Decimal(1e34),
            unlocked() { return hasUpgrade('stone', 45) && hasUpgrade('coal', 13); },
        },
        52: {
            title: "Exponential Stone",
            description: "Stone boosts itself.",
            effect() {
                return player[this.layer].points.add(1).pow(0.035);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(5e37),
            unlocked() { return hasUpgrade('stone', 51) && hasUpgrade('coal', 13); },
        },
        53: {
            title: "Process Stone",
            description: "Upgrade Processor boosts Stone at a reduced rate.",
            cost: new Decimal(1e41),
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                return new Decimal(baseEffect).pow(1.3);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
            },
            unlocked() { return hasUpgrade('stone', 52) && hasUpgrade('coal', 13); },
        },
        54: {
            title: "Really Refined",
            description: "Unlock the Stone Refinery.",
            cost: new Decimal(1e45),
            unlocked() { return hasUpgrade('stone', 53) && hasUpgrade('coal', 14); },
        },
        55: {
            title: "Refinement Trinity",
            description: "R.S boosts points, stone, and coal.",
            cost: new Decimal(1e50),
            effect() {
                return player.refinery.points.add(1).pow(0.5);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            unlocked() { return hasUpgrade('stone', 54) && hasUpgrade('coal', 15); },
        },

    },
    buyables: {
        11: {
            title: "Point Amplifier",
            cost(x) { 
                if (hasUpgrade('stone', 41)) return new Decimal(1.5).pow(x).mul(12.5);
                else return new Decimal(1.5).pow(x).mul(250);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.25).pow(amount);
                if (hasUpgrade('stone', 35)) multiplier = new Decimal(1.275).pow(amount);
                
                // Dynamically calculate the purchase limit based on warehouses
                let maxLimit = new Decimal(75).add(buyableEffect('stone', 21));
                return `Multiply your point gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(75).add(buyableEffect('stone', 21)); // Dynamic limit
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
                if (hasUpgrade('stone', 35)) return new Decimal(1.275).pow(amount);
                else return new Decimal(1.25).pow(amount);
            },
            tooltip() {
                if (hasUpgrade('stone', 41)) return ('Base Cost: 12.5 <br> Cost Scaling: 1.5 <br> Effect Scaling: 1.275')
                if (hasUpgrade('stone', 35)) return ('Base Cost: 250 <br> Cost Scaling: 1.5 <br> Effect Scaling: 1.275')
                return ('Base Cost: 250 <br> Cost Scaling: 1.5 <br> Effect Scaling: 1.25')
            },
            unlocked() {
                return hasUpgrade(this.layer, 25);
            },
        },
        12: {
            title: "Stone Amplifier",
            cost(x) { 
                if (hasUpgrade('stone', 41)) return new Decimal(1.75).pow(x).mul(1250);
                return new Decimal(1.75).pow(x).mul(25000);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.15).pow(amount);
                if (hasUpgrade('stone', 35)) multiplier = new Decimal(1.19).pow(amount);
                let maxLimit = new Decimal(50).add(buyableEffect('stone', 21));
                return `Multiply your stone gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(50).add(buyableEffect('stone', 21)); // Dynamic limit
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
                if (hasUpgrade('stone', 35)) return new Decimal(1.19).pow(amount);
                else return new Decimal(1.15).pow(amount);
            },
            tooltip() {
                if (hasUpgrade('stone', 41)) return ('Base Cost: 1,250 <br> Cost Scaling: 1.75 <br> Effect Scaling: 1.19')
                if (hasUpgrade('stone', 35)) return ('Base Cost: 25,000 <br> Cost Scaling: 1.75 <br> Effect Scaling: 1.19')
                return ('Base Cost: 25,000 <br> Cost Scaling: 1.75 <br> Effect Scaling: 1.15')
            },
            unlocked() {
                return hasUpgrade('stone', 34);
            },
        },        
        21: {
            title: "Warehouses",
            cost(x) { 
                return new Decimal(1.9).pow(x).mul(5e13);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1).mul(amount);
                let maxLimit = new Decimal(100)
                return `Purchase a warehouse to store more amplifiers. Increases amplifiers' limits by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(100)
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
                return amount;
            },
            tooltip() {
               return ('Base Cost: 5e13 <br> Cost Scaling: 1.9 <br> Special Effect: +1/Amount')
            },
            unlocked() {
                return hasUpgrade(this.layer, 42);
            }
        },
        22: {
            title: "Fortified Foundations",
            cost(x) { 
                return new Decimal(1.75).pow(x).mul(1e33);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(3).times(amount);
                if (hasUpgrade('coal', 14)) multiplier = new Decimal(4).times(amount);
                let maxLimit = new Decimal(100)
                return `Add ${format(multiplier)} to base point gain.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(100)
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
                if (hasUpgrade('coal', 14)) return amount.times(4)
                return amount.times(3);
            },
            tooltip() {
                if (hasUpgrade('coal', 14)) return ('Base Cost: 1e33 <br> Cost Scaling: 1.75 <br> Special Effect: +4/Amount')
                return ('Base Cost: 1e33 <br> Cost Scaling: 1.75 <br> Special Effect: +3/Amount')
            },
            unlocked() {
                return hasUpgrade(this.layer, 51);
            }
        },
    },
    doReset(layer) {
        if (layer == "coal") {
            if (hasUpgrade("coal", 31)) {
                layerDataReset("stone", (["upgrades", "buyables"]));
            } else if (hasUpgrade('coal', 25)) {
                layerDataReset("stone", ["upgrades"]);
            };
        } 
    },
    layerShown(){return true}
})
addLayer("coal", {
    name: "Coal", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#333333",
    requires: new Decimal(1e30), // Can be a function that takes requirement increases into account
    resource: "coal", // Name of prestige currency
    baseResource: "stone", // Name of resource prestige is based on
    baseAmount() {return player.stone.points}, // Get the current amount of baseResource
    branches: ["stone"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade('refinery', 11)) mult = mult.times(2)
        if (hasUpgrade('stone', 55)) mult = mult.times(upgradeEffect('stone', 55))
        mult = mult.times(buyableEffect('refinery', 13))
        if (hasUpgrade('coal', 21)) mult = mult.times(3)
        if (hasUpgrade('coal', 22)) mult = mult.times(3)
        if (hasUpgrade('coal', 23) && !hasUpgrade("coal", 34)) mult = mult.times(0.5)
        if (hasUpgrade('coal', 24)) mult = mult.times(3)
        if (hasUpgrade('coal', 33)) mult = mult.times(4)
        return mult
    },
    gainExp() {
        return new Decimal(0.8)
    },
    row: 1,
    hotkeys: [
        {key: "c", description: "C: Reset for coal", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Main": {
            content: ["main-display", ["display-text", "Don't forget to buy everything you want before leaving this layer. You won't be able to access Coal until you re-unlock it with 'In The Name'."], "prestige-button", "blank", "upgrades"]
        },
    },
    upgrades: {
        11: {
            title: "Point Sextupler",
            description: "Sextuple (6x) your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Triple Trouble",
            description: "Triple stone and point gain.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade('coal', 11); },
        },
        13: {
            title: "Eye for an Eye",
            description: "Unlock a new Stone upgrade for every 1st row Coal upgrade bought.",
            cost: new Decimal(12),
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                if (baseEffect > 5) {baseEffect = 5};
                return new Decimal(baseEffect);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + " Upgrades"; 
            },
            unlocked() { return hasUpgrade('coal', 12); },
        },
        14: {
            title: "Efficient Fortifications",
            description: "Fortified Foundations now adds 4 to base point gain per purchase.",
            cost: new Decimal(600),
            unlocked() { return hasUpgrade('coal', 13); },
        },
        15: {
            title: "Coal-Point Catalyst",
            description: "Boost your point gain based on coal.",
            effect() {
                return player[this.layer].points.add(1).pow(0.4);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(3000),
            tooltip() {
                return "The Catalyst is at 60% efficiency.";
            },
            unlocked() { return hasUpgrade('coal', 14); },
        },
        21: {
            title: "Is It Worth It? I",
            description: "Triple coal and stone gain, but half point gain.",
            cost: new Decimal(100000),
            unlocked() { return hasUpgrade('coal', 15); },
        },
        22: {
            title: "Is It Worth It? II",
            description: "Triple point and coal gain, but half stone gain.",
            cost: new Decimal(500000),
            unlocked() { return hasUpgrade('coal', 21); },
        },
        23: {
            title: "Is It Worth It? III",
            description: "Triple stone and point gain, but half coal gain.",
            cost: new Decimal(2500000),
            unlocked() { return hasUpgrade('coal', 22); },
        },
        24: {
            title: "Is It Worth It? IV",
            description: "Triple stone, point, and coal gain, but half R.S. gain.",
            cost: new Decimal(5000000),
            unlocked() { return hasUpgrade('coal', 23); },
        },
        25: {
            title: "No More Clicking I",
            description: "Keep stone upgrades on coal resets.",
            cost: new Decimal(25000000),
            unlocked() { return hasUpgrade('coal', 24); },
        },
        31: {
            title: "No More Clicking II",
            description: "Keep stone buyables on coal resets.",
            cost: new Decimal(200000000),
            unlocked() { return hasUpgrade('coal', 25); },
        },
        32: {
            title: "No More Clicking III",
            description: "Keep stone buyables on refinery resets.",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade('coal', 31); },
        },
        33: {
            title: "There Isn't A 4th One",
            description: "Speaking of 4: Quadruple stone, point, and coal gain.",
            cost: new Decimal(5e9),
            unlocked() { return hasUpgrade('coal', 32); },
        },
        34: {
            title: "Worth It All Along",
            description: "Remove the downsides of Is It Worth It? I-IV",
            cost: new Decimal(1.5e10),
            unlocked() { return hasUpgrade('coal', 33); },
        },
        35: {
            title: "Two M-ore-s",
            description: "Unlock the next 2 ores: Copper and Iron. [CURRENT ENDGAME]",
            cost: new Decimal(5e11),
            unlocked() { return hasUpgrade('coal', 34); },
        },
    },
    layerShown(){return (hasUpgrade('stone', 45))}
})
addLayer("refinery", {
    name: "Stone Refinery", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#444444",
    requires: new Decimal(1e45), // Can be a function that takes requirement increases into account
    resource: "refined stone", // Name of prestige currency
    baseResource: "stone", // Name of resource prestige is based on
    baseAmount() {return player.stone.points}, // Get the current amount of baseResource
    branches: ["stone"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.1, // Prestige currency exponent
    base: 5,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade('coal', 24) && !hasUpgrade("coal", 34)) mult = mult.add(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    resetDescription: "Convert your stone to ",
    hotkeys: [
        {key: "r", description: "R: Refine your stone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Main": {
            content: ["main-display", ["display-text", "Resetting for R.S. resets Stone, but Stone and Coal do not reset R.S. <br> Refinement costs do not scale traditionally, nor do they remove your refined stone. For every refinement you own, all costs increase by 1. "], "prestige-button", "blank", "upgrades", "buyables"]
        },
    },
    upgrades:{
        11: {
            title: "Time 2 Refine",
            description: "Unlock the first 2 refineries and double point, stone, and coal gain.",
            cost: new Decimal(1),
            unlocked() { return true },
        },
        12: {
            title: "Compressor",
            description: "Unlock another refinery, which increases coal gain.",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade('refinery', 11) },
        },
    },
    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "Polished Stone",
            cost(x) { 
                return new Decimal(1).add(getBuyableAmount(this.layer, 11)).add(getBuyableAmount(this.layer, 12)).add(getBuyableAmount(this.layer, 13))
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(3).pow(amount);
                
                return `Multiply your point gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} refined stone
                Amount: ${getBuyableAmount(this.layer, this.id)}`;
            },
            canAfford() { 
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id).add(1))) 
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id).add(1));
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                return new Decimal(3).pow(amount);
            },
            unlocked() {
                return hasUpgrade('refinery', 11)
            },
            tooltip() {
                return ('Effect Scaling: 3')
            },
        },
        12: {
            title: "Sharpened Stone",
            cost(x) { 
                return new Decimal(1).add(getBuyableAmount(this.layer, 11)).add(getBuyableAmount(this.layer, 12)).add(getBuyableAmount(this.layer, 13))
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(3).pow(amount);
                
                return `Multiply your stone gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} refined stone
                Amount: ${getBuyableAmount(this.layer, this.id)}`;
            },
            canAfford() { 
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id).add(1))) 
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id).add(1));
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                return new Decimal(3).pow(amount);
            },
            unlocked() {
                return hasUpgrade('refinery', 11)
            },
            tooltip() {
                return ('Effect Scaling: 3')
            },
        },
        13: {
            title: "Compressed Stone",
            cost(x) { 
                return new Decimal(2).add(getBuyableAmount(this.layer, 11)).add(getBuyableAmount(this.layer, 12)).add(getBuyableAmount(this.layer, 13))
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(3).pow(amount);
                
                return `Multiply your coal gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id).add(1)))} refined stone
                Amount: ${getBuyableAmount(this.layer, this.id)}`;
            },
            canAfford() { 
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id).add(1))) 
            },
            buy() {
                let cost = this.cost(getBuyableAmount(this.layer, this.id).add(1));
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect() {
                let amount = getBuyableAmount(this.layer, this.id);
                return new Decimal(3).pow(amount);
            },
            unlocked() {
                return hasUpgrade('refinery', 12)
            },
            tooltip() {
                return ('Effect Scaling: 3')
            },
        },
    },
    layerShown(){return (hasUpgrade('stone', 54))},
    doReset(layer) {
        if (layer == "refinery") {
            if (hasUpgrade("coal", 32)) {
                layerDataReset("stone", ["buyables"]);
            } else {
                layerDataReset("stone");
            }
        }
    }
})
