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
            name: "Repeatable Upgrades",
            done() {return hasUpgrade('stone', 25)},
            unlocked() {return true},
            tooltip: "Unlock buyables, which can be bought multiple times",
            onComplete() {}
        },
        14: {
            name: "Long Wait",
            done() {return hasUpgrade('stone', 31)},
            unlocked() {return true},
            tooltip: "Boost stone gain",
            onComplete() {}
        },
        15: {
            name: "Buy One Get One Free",
            done() {return hasUpgrade('stone', 34)},
            unlocked() {return true},
            tooltip: "Buy an upgrade that both boosts and unlocks",
            onComplete() {}
        },
        16: {
            name: "Richest Person Alive",
            done() {return player.points.gte(324000000000)},
            unlocked() {return true},
            tooltip: "Have more points than Elon Musk",
            onComplete() {}
        },
        21: {
            name: "Not That Repeatable",
            done() {return getBuyableAmount("stone", 11).gte(60) & getBuyableAmount("stone", 12).gte(30);},
            unlocked() {return true},
            tooltip: "Max out the first 2 stone buyables",
            onComplete() {}
        },
        22: {
            name: "Lose Everything",
            done() {return player.coal.points.gte(1)},
            unlocked() {return true},
            tooltip: "Reset for Coal",
            onComplete() {}
        },
        23: {
            name: "Oops, I Did it Again",
            done() {return player.coal.points.gte(3)},
            unlocked() {return true},
            tooltip: "Reset for Coal a second time",
            onComplete() {}
        },
        24: {
            name: "Welcome Back",
            done() {return hasUpgrade('stone', 51)},
            unlocked() {return true},
            tooltip: "I thought there weren't any more Stone upgrades!",
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
        if (hasUpgrade("stone", 43)) mult = mult.times(upgradeEffect("stone", 43))
        if (hasUpgrade("stone", 44)) mult = mult.times(upgradeEffect("stone", 15))
        if (hasUpgrade('stone', 45) & hasAchievement("a", 22)) mult = mult.times(2)
        if (hasUpgrade("coal", 12)) mult = mult.times(3)
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
                let baseEffect = hasUpgrade("stone", 23) 
                    ? player[this.layer].points.add(1).pow(0.370) 
                    : player[this.layer].points.add(1).pow(0.222);
                
                if (baseEffect.gte(500)) {
                    baseEffect = baseEffect.div(500).pow(0.05).mul(500); 
                }
            
                return baseEffect;
            },            
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
            tooltip() {
                let baseEffect = hasUpgrade("stone", 23) 
                ? player[this.layer].points.add(1).pow(0.370) 
                : player[this.layer].points.add(1).pow(0.222);
                
                if (baseEffect.gte(500)) return "This Catalyst is softcapped, making effect progress past 500x raised to 0.05"
                if (hasUpgrade('stone', 23)) return "This Catalyst is at 100% efficiency.";
                return "The Catalyst is at 60% efficiency.";
            },
            unlocked() {return hasUpgrade('stone', 13)}
        },
        15: {
            title: "Upgrade Processor",
            description: "Purchased stone upgrades boost point gain",
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                if (hasUpgrade('stone', 45) & hasAchievement("a", 22)) {
                    return new Decimal(baseEffect).pow(0.9);
                }
                if (hasUpgrade('stone', 44)) {
                    return new Decimal(baseEffect).pow(0.8);
                }
                return new Decimal(baseEffect).pow(0.5);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"},
            cost: new Decimal(25),
            unlocked() { return hasUpgrade('stone', 14)},
        },
        21: {
            title: "Exponential Points",
            description: "Points boost themselves",
            effect() {
                let baseEffect = player.points.pow(0.123).add(1);
                if (baseEffect.gte(50)) {
                    baseEffect = baseEffect.div(50).pow(0.25).mul(50);
                }
                return baseEffect;
            },            
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"},
            cost: new Decimal(50),
            tooltip() {
                let baseEffect = player.points.pow(0.123).add(1);

                if (baseEffect.gte(50)) return "This upgrade is softcapped, making effect progress past 50x raised to 0.25."
            },
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
            description: "Add 0.3 to base point gain",
            cost: new Decimal(350),
            unlocked() { return hasUpgrade('stone', 23); },
        },
        25: {
            title: "New Frontiers",
            description: "Unlock the Buyables tab",
            cost: new Decimal(550),
            unlocked() { return hasUpgrade('stone', 24); },
        },
        31: {
            title: "Finally, Boosting Stone!",
            description: "Multiply stone gain by 2",
            cost: new Decimal(3500),
            unlocked() { return hasUpgrade('stone', 25); },
        },
        32: {
            title: "Point Quadrupler",
            description: "Multiply point generation by 4",
            cost: new Decimal(8500),
            unlocked() { return hasUpgrade('stone', 31); },
        },
        33: {
            title: "Double Trouble",
            description: "Multiply point and stone gain by 2",
            cost: new Decimal(32000),
            unlocked() { return hasUpgrade('stone', 32); },
        },
        34: {
            title: "Two in One",
            description: "Unlock another buyable, and base point gain is 1",
            cost: new Decimal(150000),
            unlocked() { return hasUpgrade('stone', 33); },
        },
        35: {
            title: "Reinforced Buyables",
            description: "Increase buyable effect scaling",
            cost: new Decimal(700000),
            unlocked() { return hasUpgrade('stone', 34); },
        },
        41: {
            title: "Cheaper Buyables",
            description: "Divide Buyable's base cost by 4",
            cost: new Decimal(6000000),
            unlocked() { return hasUpgrade('stone', 35); },
        },
        42: {
            title: "Wacky Warehouses",
            description: "Unlock another buyable",
            cost: new Decimal(2.5e9),
            unlocked() { return hasUpgrade('stone', 41); },
        },
        43: {
            title: "Point-Stone Catalyst",
            description: "Boost your stone gain based on points.",
            effect() {
                if (hasUpgrade('stone', 45) & hasAchievement("a", 22)) {return player.points.add(1).pow(0.08);}
                return player.points.add(1).pow(0.05);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(5e10),
            tooltip() {
                if (hasUpgrade('stone', 45) & hasAchievement("a", 22)) {return "This Catalyst is at 100% efficiency."}
                return "This Catalyst is at 60% efficiency.";
            },
            unlocked() { return hasUpgrade('stone', 42); },
        },
        44: {
            title: "Reinforced Processor",
            description: "Upgrade Processor's boost is stronger, and boosts stone. (Upgrades^0.5 -> Upgrades^0.8)",
            cost: new Decimal(2e12),
            unlocked() { return hasUpgrade('stone', 43); },
        },
        45: {
            title: "In The Name",
            description() {
                return hasAchievement("a", 22) 
                    ? "This upgrade now boosts various other upgrades and currencies." 
                    : "Unlock the first Ore, Coal.";
            },
            cost: new Decimal(1e15),
            tooltip(){if (hasAchievement("a", 22)) return "Upgrade Processor's Effect is Upgrades^0.9, Point-Stone Catalyst has 100% efficiency, and double point and stone gain."},
            unlocked() { return hasUpgrade('stone', 44); },
        },
        51: {
            title: "Storage Expansion",
            description: "Double max Warehouses and divide base cost by 5",
            effect(){
                if (hasUpgrade("stone", 51)){return new Decimal(40)}
                else return new Decimal(0)
            },
            cost: new Decimal(2.5e18),
            unlocked() { return hasUpgrade('stone', 45) & hasUpgrade('coal', 13); },
        },
    },

    buyables: {
        11: {
            title: "Point Amplifier",
            cost(x) { 
                if (hasUpgrade('stone', 41)) return new Decimal(1.325).pow(x).mul(15);
                return new Decimal(1.325).pow(x).mul(60);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.25).pow(amount);
                if (hasUpgrade('stone', 35)) multiplier = new Decimal(1.275).pow(amount);
                let maxLimit = new Decimal(60).add(buyableEffect('stone', 21));
                return `Multiply your point gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(60).add(buyableEffect('stone', 21));
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
                if (hasUpgrade('stone', 41)) return ('Base Cost: 15 <br> Cost Scaling: 1.325 <br> Effect Scaling: 1.275')
                if (hasUpgrade('stone', 35)) return ('Base Cost: 60 <br> Cost Scaling: 1.325 <br> Effect Scaling: 1.275')
                else return ('Base Cost: 60 <br> Cost Scaling: 1.325 <br> Effect Scaling: 1.25')
            },
            unlocked() {
                return hasUpgrade(this.layer, 25);
            },
        },
        12: {
            title: "Stone Amplifier",
            cost(x) { 
                if (hasUpgrade('stone', 41)) return new Decimal(1.4).pow(x).mul(15000)
                return new Decimal(1.4).pow(x).mul(60000);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.15).pow(amount);
                if (hasUpgrade('stone', 35)) multiplier = new Decimal(1.175).pow(amount);
                let maxLimit = new Decimal(30).add(buyableEffect('stone', 21));
                return `Multiply your stone gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(30).add(buyableEffect('stone', 21)); // Dynamic limit
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
                if (hasUpgrade('stone', 35)) return new Decimal(1.175).pow(amount);
                else return new Decimal(1.15).pow(amount);
            },
            tooltip() { 
                if (hasUpgrade('stone', 41)) return ('Base Cost: 15000 <br> Cost Scaling: 1.4 <br> Effect Scaling: 1.175')
                if (hasUpgrade('stone', 35)) return ('Base Cost: 60000 <br> Cost Scaling: 1.4 <br> Effect Scaling: 1.175')
                else return ('Base Cost: 60000 <br> Cost Scaling: 1.4 <br> Effect Scaling: 1.15')
            },
            unlocked() {
                return hasUpgrade(this.layer, 34);
            },
        },
        21: {
            title: "Warehouses",
            cost(x) { 
                if (hasUpgrade("stone", 51)) {return new Decimal(1.75).pow(x).mul(2e7)}
                return new Decimal(1.75).pow(x).mul(1e8);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1).mul(amount);
                let maxLimit = new Decimal(40).add(upgradeEffect('stone', 51));
                return `Purchase a warehouse to store more amplifiers. Increases amplifiers' limits by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(40).add(upgradeEffect('stone', 51))
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
                return amount;
            },
            tooltip() {
                if (hasUpgrade("stone", 51)){return ('Base Cost: 2e7 <br> Cost Scaling: 1.75 <br> Special Effect: +1/Amount')}
                return ('Base Cost: 1e8 <br> Cost Scaling: 1.75 <br> Special Effect: +1/Amount')
            },
            unlocked() {
                return hasUpgrade(this.layer, 42);
            }
        },
    },
    hotkeys: [
        {key: "s", description: "S: Reset for stone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "coal", // Name of prestige currency
    baseResource: "stone", // Name of resource prestige is based on
    baseAmount() {return player.stone.points}, // Get the current amount of baseResource
    branches: ["stone"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
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
    },
    upgrades: {
        11: {
            title: "Do It Again",
            description: "Base Point gain starts at 3",
            cost: new Decimal(1),
        },
        12: {
            title: "Triple Trouble",
            description: "Triple Stone and point gain.",
            cost: new Decimal(5),
        },
        13: {
            title: "Eye for an Eye",
            description: "Unlock a new Stone upgrade for every 1st row Coal upgrade bought.",
            cost: new Decimal(20),
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                if (baseEffect > 5) {baseEffect = 5};
                return new Decimal(baseEffect);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)); 
            },
            unlocked() { return hasUpgrade('coal', 12); },
        },
    },
    layerShown(){
        let isUnlocked = false
        if (hasUpgrade('stone', 45)){isUnlocked = true}
        if (hasAchievement('a', 22)){isUnlocked = true}
        return isUnlocked}
})
