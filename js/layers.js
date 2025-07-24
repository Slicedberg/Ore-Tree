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
            name: "Not That Repeatable",
            done() {return getBuyableAmount("stone", 11).gte(60) & getBuyableAmount("stone", 12).gte(30);},
            unlocked() {return true},
            tooltip: "Max out the first 2 stone buyables",
            onComplete() {}
        },
        21: {
            name: "Lose Everything",
            done() {return player.coal.points.gte(1)},
            unlocked() {return true},
            tooltip: "Reset for Coal",
            onComplete() {}
        },
        22: {
            name: "Oops, I Did it Again",
            done() {return player.coal.points.gte(3)},
            unlocked() {return true},
            tooltip: "Reset for Coal a second time",
            onComplete() {}
        },
        23: {
            name: "Welcome Back",
            done() {return hasUpgrade('stone', 51)},
            unlocked() {return true},
            tooltip: "I thought there weren't any more Stone upgrades!",
            onComplete() {}
        },
        24: {
            name: "Buyable Grid",
            done() {return hasUpgrade('stone', 54)},
            unlocked() {return true},
            tooltip: "Have 4 stone buyables unlocked.",
            onComplete() {}
        },
        25: {
            name: "Milestoned",
            done() {return hasMilestone('mile', 1)},
            unlocked() {return true},
            tooltip: "Get your first Milestone.",
            onComplete() {}
        },
        26: {
            name: "Lucky Mile 7",
            done() {return player.mile.points.gte(7)},
            unlocked() {return true},
            tooltip: "Have 7 MileStones",
            onComplete() {}
        },
        31: {
            name: "I Like a Good Challenge",
            done() {return hasUpgrade("mile", 11)},
            unlocked() {return true},
            tooltip: "Unlock Challenges",
            onComplete() {}
        },
        32: {
            name: "Lucky Challenge 7",
            
            comp() {
                // Total completions of all challenges in the "stone" layer
                let total = new Decimal(0);
                for (let id in player.mile.challenges) {
                    total = total.add(player.mile.challenges[id] || 0);
                }
                return total;
            },
            done() {return this.comp().gte(7)},
            unlocked() {return true},
            tooltip: "Have a lucky number of completions.",
            onComplete() {}
        },
        33: {
            name: "Always Has Been",
            done() {return hasUpgrade("coal", 35)},
            unlocked() {return true},
            tooltip: "Remove those pesky downsides.",
            onComplete() {}
        },
        34: {
            name: "Deja Vu",
            done() {return hasUpgrade("mile", 12)},
            unlocked() {return true},
            tooltip: "Unlock buyables, again.",
            onComplete() {}
        },
        35: {
            name: "30 Decades of Progress",
            done() {return player.mile.points.gte(30)},
            unlocked() {return true},
            tooltip: "since when are milestones years?",
            onComplete() {}
        },
        36: {
            name: "Pick your Poison",
            done() {return hasUpgrade("mile", 13)},
            unlocked() {return true},
            tooltip: "Unlock Iron and Lead.",
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
        if (hasUpgrade("stone", 53)) mult = mult.add(6)
        if (hasUpgrade("coal", 22) & !inChallenge("mile", 12)) mult = mult.add(buyableEffect('stone', 22).div(20))

        if (hasUpgrade("stone", 31)) mult = mult.times(2)
        if (hasUpgrade("stone", 33)) mult = mult.times(2)
        if (!inChallenge("mile", 12)) mult = mult.times(buyableEffect('stone', 12))
        if (hasUpgrade("stone", 43)) mult = mult.times(upgradeEffect("stone", 43))
        if (hasUpgrade("stone", 44)) mult = mult.times(upgradeEffect("stone", 15))
        if (hasUpgrade('stone', 45) & hasAchievement("a", 21)) mult = mult.times(2)
        if (hasUpgrade("coal", 12)) mult = mult.times(3)
        if (hasUpgrade("stone", 52)) mult = mult.times(upgradeEffect("stone", 52))
        if (hasUpgrade("coal", 15)) mult = mult.times(upgradeEffect("coal", 15))
        if (hasMilestone("mile", 1)) mult = mult.times(2)
        if (hasUpgrade('stone', 55) & hasAchievement("a", 25)) mult = mult.times(2)
        if (hasMilestone("mile", 4)) mult = mult.times(player.mile.points.pow(2).max(1));

        if (hasChallenge("mile", 11)) mult = mult.times(challengeEffect("mile", 11));
        if (hasUpgrade("coal", 31) & !hasUpgrade("coal", 35)) mult = mult.div(2);	
        if (hasUpgrade("coal", 32)) mult = mult.times(5);
        if (hasUpgrade("coal", 33)) mult = mult.times(5);
        if (hasUpgrade("coal", 34)) mult = mult.times(5);
        if (hasUpgrade("coal", 43)) mult = mult.times(upgradeEffect("coal", 43));
        
        if (hasChallenge("mile", 12)) mult = mult.times(challengeEffect("mile", 12));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {return buyableEffect("coal", 11)},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    doReset(resettingLayer) {
        // Don't override default behavior unless it's a higher layer or a side layer
        if (layers[resettingLayer].row > this.row) {
            let keep = [];
    
            // Keep buyables if milestone 8 is achieved and the reset is from coal or mile
            if ((resettingLayer === "coal" || resettingLayer === "mile") && hasMilestone("mile", 8)) {
                keep.push("buyables");
            }
    
            layerDataReset(this.layer, keep);
        }
    },    
    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "blank", "upgrades"]
        },
        
        "Buyables": {
            content: ["main-display", "prestige-button", "blank", "buyables"],
            unlocked() {
                if (inChallenge("mile", 12)) return false
                else return hasUpgrade('stone', 25)},
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
                if (hasUpgrade('stone', 23)) return "This Catalyst is at 100% efficiency";
                return "The Catalyst is at 60% efficiency";
            },
            unlocked() {return hasUpgrade('stone', 13)}
        },
        15: {
            title: "Upgrade Processor",
            description: "Purchased stone upgrades boost point gain",
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                if (hasUpgrade('coal', 45)) {
                    return new Decimal(baseEffect).pow(1.5);
                }
                if (hasUpgrade('stone', 55) & hasAchievement("a", 25)) {
                    return new Decimal(baseEffect).pow(1);
                }
                if (hasUpgrade('stone', 45) & hasAchievement("a", 21)) {
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

                if (baseEffect.gte(50)) return "This upgrade is softcapped, making effect progress past 50x raised to 0.25"
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
            description: "Unlock another buyable, and add 0.5 to base point gain",
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
            description: "Boost your stone gain based on points",
            effect() {
                let baseEffect = player.points.add(1).pow(0.05)
                if (hasUpgrade('stone', 45) & hasAchievement("a", 21)) {baseEffect = player.points.add(1).pow(0.08);}
                if (baseEffect.gte(50)) {
                    baseEffect = baseEffect.div(50).pow(0.25).mul(50);
                }
                return baseEffect;
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(5e10),
            tooltip() {
                let baseEffect = player.points.add(1).pow(0.05)
                if (hasUpgrade('stone', 45) & hasAchievement("a", 21)) {baseEffect = player.points.add(1).pow(0.08);}
                if (baseEffect.gte(50)) {
                    return "This Catalyst is softcapped, making effect progress past 50x raised to 0.25"
                }
                if (hasUpgrade('stone', 45) & hasAchievement("a", 21)) {return "This Catalyst is at 100% efficiency"}
                return "This Catalyst is at 60% efficiency";
            },
            unlocked() { return hasUpgrade('stone', 42); },
        },
        44: {
            title: "Reinforced Processor",
            description: "Upgrade Processor's boost is stronger (Upgrades^0.8), and boosts stone.",
            cost: new Decimal(2e12),
            unlocked() { return hasUpgrade('stone', 43); },
        },
        45: {
            title: "In The Name",
            description() {
                return hasAchievement("a", 21) 
                    ? "This upgrade now boosts various other upgrades and currencies" 
                    : "Unlock the first Ore, Coal";
            },
            cost: new Decimal(1e15),
            tooltip(){if (hasAchievement("a", 21)) return "Upgrade Processor's Effect is Upgrades^0.9, Point-Stone Catalyst has 100% efficiency, and double point and stone gain"},
            unlocked() { return hasUpgrade('stone', 44); },
        },
        51: {
            title: "Storage Expansion",
            description: "Double max Warehouses and divide base cost by 8",
            effect(){
                if (hasUpgrade("stone", 51)){return new Decimal(40)}
                else return new Decimal(0)
            },
            cost: new Decimal(2.5e18),
            unlocked() { return hasUpgrade('stone', 45) & hasUpgrade('coal', 13); },
        },
        52: {
            title: "Exponential Stone",
            description: "Stone boosts itself",
            effect() {
                let baseEffect = player.stone.points.add(1).pow(0.07);
                if (hasUpgrade('stone', 55) & hasAchievement("a", 25)) {
                    baseEffect = player.stone.points.add(1).pow(0.09)
                }
                if (baseEffect.gte(50)) {
                    baseEffect = baseEffect.div(50).pow(0.25).mul(50);
                }
                return baseEffect;
            },            
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"},
            cost: new Decimal(1e20),
            tooltip() {
                let baseEffect = player.stone.points.add(1).pow(0.07)
                if (baseEffect.gte(50)) return "This upgrade is softcapped, making effect progress past 50x raised to 0.25"
            },
            unlocked() { return hasUpgrade('stone', 51) & hasUpgrade('coal', 13);},
        },
        53: {
            title: "Foreshadowing",
            description: "Add 12 to base point gain and 6 to base stone gain",
            cost: new Decimal(2.3e23),
            unlocked() { return hasUpgrade('stone', 52) & hasUpgrade('coal', 13); },
        },
        54: {
            title: "Based Buyables",
            description: "Unlock another buyable and increase max levels for each buyable by 5",
            effect(){
                if (hasUpgrade("stone", 54)){return new Decimal(5)}
                else return new Decimal(0)
            },
            cost: new Decimal(6e26),
            unlocked() { return hasUpgrade('stone', 53) & hasUpgrade('coal', 14); },
        },
        55: {
            title: "Bad Pun",
            description() {
                return hasAchievement("a", 25) 
                    ? "This upgrade now boosts various other upgrades and currencies" 
                    : "Unlock MileStones";
            },
            cost: new Decimal(1e30),
            tooltip(){if (hasAchievement("a", 25)) return "Upgrade Processor's Effect is Upgrades^1, Exponential Stone is stronger, and double point and stone gain"},
            unlocked() { return hasUpgrade('stone', 54) & hasUpgrade('coal', 15); },
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
                let maxLimit = new Decimal(60).add(buyableEffect('stone', 21)).add(upgradeEffect("stone", 54)).add(upgradeEffect("coal", 44));
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
                return `Multiply your point gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(60).add(buyableEffect('stone', 21)).add(upgradeEffect("stone", 54)).add(upgradeEffect("coal", 44));
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
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
                let maxLimit = new Decimal(30).add(buyableEffect('stone', 21)).add(upgradeEffect("stone", 54)).add(upgradeEffect("coal", 44));
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
                return `Multiply your stone gain by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(30).add(buyableEffect('stone', 21)).add(upgradeEffect("stone", 54)).add(upgradeEffect("coal", 44)); // Dynamic limit
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
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
                if (hasUpgrade("stone", 51)) {return new Decimal(1.75).pow(x).mul(1.25e7)}
                return new Decimal(1.75).pow(x).mul(1e8);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1).mul(amount);
                let maxLimit = new Decimal(40).add(upgradeEffect('stone', 51)).add(upgradeEffect("stone", 54)).add(upgradeEffect("coal", 24))
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
                return `Purchase a warehouse to store more amplifiers. Increases amplifiers' limits by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} stone
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(40).add(upgradeEffect('stone', 51)).add(upgradeEffect("stone", 54)).add(upgradeEffect("coal", 24))
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
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
                if (hasUpgrade("stone", 51)){return ('Base Cost: 1.25e7 <br> Cost Scaling: 1.75 <br> Special Effect: +1/Amount')}
                return ('Base Cost: 1e8 <br> Cost Scaling: 1.75 <br> Special Effect: +1/Amount')
            },
            unlocked() {
                return hasUpgrade(this.layer, 42);
            }
        },
        22: {
            title: "Fortified Foundations",
            cost(x) { 
                if (hasUpgrade("coal", 21)) {
                    return new Decimal(1.6).pow(x).mul(2.5e24);
                }
                return new Decimal(1.6).pow(x).mul(2.5e25);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(6).times(amount);
                if (hasUpgrade("coal", 21)) {
                    multiplier = new Decimal(20).times(amount);
                }
                let maxLimit = new Decimal(100).add(upgradeEffect("coal", 44));
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
                return `Add ${format(multiplier)} to base point gain.
                Cost: ${format(this.cost(amount))} stone
                Amount: ${amount} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(100).add(upgradeEffect("coal", 44));
                if (hasMilestone("mile", 6)) maxLimit = maxLimit.add(tmp.mile.milestones[6].effect);
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
                if (hasUpgrade("coal", 21)) {
                    return amount.times(20);
                }
                return amount.times(6);
            },
            tooltip() {
                if (hasUpgrade("coal", 21)) {
                    return 'Base Cost: 2.5e24 <br> Cost Scaling: 1.6 <br> Special Effect: +20/Amount';
                }
                return 'Base Cost: 2.5e25 <br> Cost Scaling: 1.6 <br> Special Effect: +6/Amount';
            },
            unlocked() {
                return hasUpgrade(this.layer, 54);
            },  
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
    color: "#343434",
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "coal", // Name of prestige currency
    baseResource: "stone", // Name of resource prestige is based on
    baseAmount() {return player.stone.points}, // Get the current amount of baseResource
    branches: ["stone"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() {
        mult = new Decimal(1)
        if (hasMilestone("mile", 1)) mult = mult.times(2)
        if (hasMilestone("mile", 5)) mult = mult.times(player.mile.points.max(1));
        if (hasUpgrade("coal", 31)) mult = mult.times(5);	
        if (hasUpgrade("coal", 32)) mult = mult.times(5);	
        if (hasUpgrade("coal", 33) & !hasUpgrade("coal", 35)) mult = mult.div(2);
        if (hasUpgrade("coal", 34)) mult = mult.times(5);

        if (hasUpgrade("coal", 41)) mult = mult.times(upgradeEffect("coal", 41));
        if (hasUpgrade("coal", 45)) mult = mult.times(upgradeEffect("coal", 45));
        
        if (hasChallenge("mile", 12)) mult = mult.times(challengeEffect("mile", 12));
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
            unlocked() {return hasUpgrade("mile", 12)}
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
            description: "Triple Stone and point gain",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('coal', 11); },
        },
        13: {
            title: "Eye for an Eye",
            description: "Multiply point gain and unlock a new Stone upgrade for every 1st row Coal upgrade bought",
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
        14: {
            title: "Coal-Point Catalyst",
            description: "Boost your point gain based on coal",
            effect() {
                let baseEffect = player[this.layer].points.add(1).pow(0.375);
                if (hasUpgrade("coal", 23)){baseEffect = player[this.layer].points.add(1).pow(0.42)}
                if (baseEffect.gte(5000)) {
                    baseEffect = baseEffect.div(5000).pow(0.1).mul(5000);
                }
                return baseEffect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(25000),
            tooltip() {
                let baseEffect = player[this.layer].points.add(1).pow(0.375);
                if (hasUpgrade("coal", 23)){baseEffect = player[this.layer].points.add(1).pow(0.42)}
                
                if (baseEffect.gte(5000)) {return "This catalyst is softcapped, raising progress past 5000 to 0.1."}
                if (hasUpgrade("coal", 23)){return "The Catalyst is at 100% efficiency"}
                return "The Catalyst is at 75% efficiency";
            },
            unlocked() { return hasUpgrade('coal', 13); },
        },
        15: {
            title: "Coal-Stone Catalyst",
            description: "Boost your stone gain based on coal",
            effect() {
                let baseEffect = player[this.layer].points.add(1).pow(0.25)
                if (hasUpgrade("coal", 23)){baseEffect = player[this.layer].points.add(1).pow(0.3)}
                if (baseEffect.gte(500)) {
                    baseEffect = baseEffect.div(500).pow(0.1).mul(500);
                }
                return baseEffect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; },
            cost: new Decimal(250000),
            tooltip() {
                let baseEffect = player[this.layer].points.add(1).pow(0.25);
                if (hasUpgrade("coal", 23)){baseEffect = player[this.layer].points.add(1).pow(0.3)}
                
                if (baseEffect.gte(500)) {return "This catalyst is softcapped, raising progress past 500 to 0.1."}
                if (hasUpgrade("coal", 23)){return "The Catalyst is at 100% efficiency"}
                return "The Catalyst is at 75% efficiency";
            },
            unlocked() { return hasUpgrade('coal', 14); },
        },
        21: {
            title: "Efficient Foundations",
            description: "Fortified Foundations' effect is increased to +20/Amount, and divide base cost by 10.",
            cost: new Decimal(5000000),
            unlocked() { return hasUpgrade('coal', 15) & hasMilestone('mile', 2); },
        },
        22: {
            title: "Multipurpose Foundations",
            description: "Fortified Foundations adds to base stone gain aswell, but at a reduced rate (/20)",
            cost: new Decimal(60000000),
            unlocked() { return hasUpgrade('coal', 21) & hasMilestone('mile', 2); },
        },
        23: {
            title: "Polished Coal Catalysts",
            description: "Increase the efficiency of both coal catalysts unlocked so far up to 100%",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade('coal', 22) & hasMilestone('mile', 2); },
        },
        24: {
            title: "Grin-D",
            description: "Add 1 to max Warehouses for every coal upgrade bought.",
            cost: new Decimal(1.2e10),
            effect() {
                let baseEffect = 0;
                if (hasUpgrade('coal', 24)){baseEffect = player[this.layer].upgrades.length}
                return new Decimal(baseEffect);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)); 
            },
            unlocked() { return hasUpgrade('coal', 23) & hasMilestone('mile', 2); },
        },
        25: {
            title: "Kilometerstones",
            description: "Unlock Milestone upgrades.",
            cost: new Decimal(1.11e11),
            unlocked() { return hasUpgrade('coal', 24) & hasMilestone('mile', 2); },
        },
        31: {
            title: "Is it Worth it? I",
            description: "5x coal and point gain, but halve stone gain.",
            cost: new Decimal(1e12),
            unlocked() { return hasUpgrade('coal', 25)},
        },
        32: {
            title: "Is it Worth it? II",
            description: "5x coal and stone gain, but halve point gain.",
            cost: new Decimal(1e13),
            unlocked() { return hasUpgrade('coal', 31)},
        },
        33: {
            title: "Is it Worth it? III",
            description: "5x point and stone gain, but halve coal gain.",
            cost: new Decimal(5e14),
            unlocked() { return hasUpgrade('coal', 32)},
        },
        34: {
            title: "Is it Worth it? IV",
            description: "5x point, stone and coal gain, but increase milestone scaling.",
            cost: new Decimal(1.5e15),
            unlocked() { return hasUpgrade('coal', 33)},
        },
        35: {
            title: "Wait, It Was Always Worth It?",
            description: "Remove the downsides of Is it Worth it? I-IV.",
            cost: new Decimal(6.1e16),
            unlocked() { return hasUpgrade('coal', 34)},
        },
        41: {
            title: "Exponential Coal",
            description: "Coal boosts itself",
            cost: new Decimal(2e20),
            effect() {
                let baseEffect = player.coal.points.pow(0.08).add(1);
                if (baseEffect.gte(100)) {
                    baseEffect = baseEffect.div(100).pow(0.1).mul(100);
                }
                return baseEffect;
            },            
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"},
            tooltip() {
                let baseEffect = player.coal.points.pow(0.08).add(1)
                if (baseEffect.gte(100)) return "This upgrade is softcapped, making effect progress past 100x raised to 0.1"
            },
            unlocked() { return hasUpgrade('coal', 35) & hasUpgrade("mile", 12)},
        },
        42: {
            title: "Another Upgrade Processor",
            description: "Coal Upgrades boost point gain",
            cost: new Decimal(5e22),
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                if (hasUpgrade("coal", 45)) return new Decimal(baseEffect).pow(1.5)
                return new Decimal(baseEffect);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() { return hasUpgrade('coal', 41)},
        },
        43: {
            title: "New Processor Unit",
            description: "AUP boosts stone at a reduced rate (^0.8)",
            cost: new Decimal(2.4e24),
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                if (hasUpgrade("coal", 45)) return new Decimal(baseEffect).pow(1.5).pow(0.8)
                return new Decimal(baseEffect).pow(0.8);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() { return hasUpgrade('coal', 42)},
        },
        44: {
            title: "Grin-D-er",
            description: "Grin-D adds to all stone buyables, but at a reduced rate. (/2, rounded down)",
            cost: new Decimal(5e25),
            effect() {
                let baseEffect = 0;
                if (hasUpgrade('coal', 44)) {
                    baseEffect = new Decimal(player[this.layer].upgrades.length).div(2).floor();
                }
                return baseEffect;
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)); 
            },
            unlocked() { return hasUpgrade('coal', 43) },
        },
        45: {
            title: "Yet Another Processor Upgrade",
            description: "Raise Upgrade Processor and AUP to 1.5, and AUP boosts coal gain at a reduced rate.",
            cost: new Decimal(1e27),
            effect() {
                let baseEffect = player[this.layer].upgrades.length;
                return new Decimal(baseEffect).pow(1.5).pow(0.6);
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() { return hasUpgrade('coal', 44)},
        },
        
    },
    buyables: {
        11: {
            title: "Autostone",
            cost(x) { 
                return new Decimal(1.3).pow(x).mul(1e19);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(0.005).times(amount).times(buyableEffect("coal", 21));
                let maxLimit = new Decimal(100)
                return `Automatically gain ${format(multiplier.times(100))}% of stone/s.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} coal
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(100)
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
                return new Decimal(0.005).times(amount).times(buyableEffect("coal", 21));
            },
            
            tooltip() { 
                return ('Base Cost: 1e19 <br> Cost Scaling: 1.3 <br> Effect Scaling: +0.5/Amount')
            },
            unlocked() {
                return true;
            },
        },
        12: {
            title: "Challenge Compressor",
            cost(x) { 
                return new Decimal(1.5).pow(x).mul(2e19);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.1).pow(amount).times(buyableEffect("coal", 21));
                let maxLimit = new Decimal(30)
                return `Divide base Unbuyable goal and MileStone requirement by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} coal
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(30)
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
                return new Decimal(1.1).pow(amount).times(buyableEffect("coal", 21)); // BSM effect
            },
            tooltip() { 
                return ('Base Cost: 2e19 <br> Cost Scaling: 1.5 <br> Effect Scaling: 1.1')
            },
            unlocked() {
                return true;
            },
        },
        21: {
            title: "Buyable Support Module",
            cost(x) { 
                return new Decimal(1.5).pow(x).mul(1e27);
            },
            display() {
                let amount = getBuyableAmount(this.layer, this.id);
                let multiplier = new Decimal(1.1).pow(amount);
                let maxLimit = new Decimal(20);
                return `Multiplies the effects of the other coal buyables by ${format(multiplier)}.
                Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} coal
                Amount: ${getBuyableAmount(this.layer, this.id)} / ${maxLimit}`;
            },
            canAfford() { 
                let maxLimit = new Decimal(20);
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
                return new Decimal(1.1).pow(amount);
            },
            tooltip() { 
                return ('Base Cost: 1e27 <br> Cost Scaling: 1.5 <br> Effect Scaling: 1.1')
            },
            unlocked() {
                return hasMilestone("mile", 9);
            },
        },
        
    },
    layerShown(){
        let isUnlocked = false
        if (hasUpgrade('stone', 45)){isUnlocked = true}
        if (hasAchievement('a', 21)){isUnlocked = true}
        return isUnlocked}
})
addLayer("mile", {
    name: "Milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MS", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#555555",
    requires: new Decimal(1e30), // Can be a function that takes requirement increases into account
    resource: "MileStones", // Name of prestige currency
    baseResource: "stone", // Name of resource prestige is based on
    baseAmount() {return player.stone.points}, // Get the current amount of baseResource
    branches: ["stone"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.03, // Prestige currency exponent
    base: 10,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("coal", 34) & !hasUpgrade("coal", 35)) mult = mult.times(3);
        if (hasMilestone("mile", 7)) mult = mult.div(3)
        mult = mult.div(buyableEffect("coal", 12))
        if (hasChallenge("mile", 12)) mult = mult.div(challengeEffect("mile", 12));
        return mult

    },
    gainExp() {
        return new Decimal(1)
    },
    
    row: 1,
    hotkeys: [
        {key: "M", description: "M: Reset for a Milestone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "blank", "milestones", "upgrades"]
        },
        "Challenges": {
            content: ["main-display", "prestige-button", "blank", "challenges"],
            unlocked() {return hasUpgrade('mile', 11)},
        },
    },
    canBuyMax() {
        if (hasUpgrade('mile', 11)) {return true}
        else return false
    },
    milestones: {
        1: {
            requirementDescription: "1 MileStone",
            effectDescription: "Milestones are upgrades that do not need to be bought. You will have to focus on doing both Coal and MileStone resets from now on. This milestone doubles point, stone, and coal gain.",
            done() { return player.mile.points.gte(1) },
            shown() {return true}
        },
        2: {
            requirementDescription: "2 MileStones",
            effectDescription: "Congrats on your second Milestone. This unlocks the next row of Coal upgrades.",
            done() { return player.mile.points.gte(2) },
            unlocked() {return hasMilestone("mile", 1)}
        },
        3: {
            requirementDescription: "3 MileStones",
            effectDescription() { 
                return `MileStones^3 boost point gain. Currently: ${format(this.effect())}x`;
            },
            done() { return player.mile.points.gte(3); },
            effect() {
                return player.mile.points.pow(3).max(1); // Ensures at least x1 boost
            },
            unlocked() {return hasMilestone("mile", 2)}
        },
        4: {
            requirementDescription: "5 MileStones",
            effectDescription() { 
                return `MileStones^2 boost stone gain. Currently: ${format(this.effect())}x`;
            },
            done() { return player.mile.points.gte(5); },
            effect() {
                return player.mile.points.pow(2).max(1); // Ensures at least x1 boost
            },
            unlocked() {return hasMilestone("mile", 3)}
        },
        5: {
            requirementDescription: "10 MileStones",
            effectDescription() { 
                return `MileStones boost coal gain. Currently: ${format(this.effect())}x`;
            },
            done() { return player.mile.points.gte(10); },
            effect() {
                return player.mile.points.max(1); // Ensures at least x1 boost
            },
            unlocked() {return hasMilestone("mile", 4)}
        },
        6: {
            requirementDescription: "13 MileStones",
            effectDescription() { 
                return `Challenge completions add to stone buyable limits. Currently: +${format(this.effect())}`;
            },
            done() { return player.mile.points.gte(13); },
            effect() {
                // Total completions of all challenges in the "stone" layer
                let total = new Decimal(0);
                for (let id in player.mile.challenges) {
                    total = total.add(player.mile.challenges[id] || 0);
                }
                return total;
            },
            unlocked() {return hasMilestone("mile", 5)}
        },
        7: {
            requirementDescription: "18 MileStones",
            effectDescription() { 
                return `Decrease MileStone and challenge scaling.`;
            },
            done() { return player.mile.points.gte(18); },
            effect() {
            },
            unlocked() {return hasMilestone("mile", 6)}
        },
        8: {
            requirementDescription: "24 MileStones",
            effectDescription() { 
                return `Keep stone buyables on Coal and MileStone resets.`;
            },
            done() { return player.mile.points.gte(24); },
            effect() {
            },
            unlocked() {return hasMilestone("mile", 7)}
        },
        9: {
            requirementDescription: "36 MileStones",
            effectDescription() { 
                return `Unlock another Coal Buyable.`;
            },
            done() { return player.mile.points.gte(36); },
            effect() {
            },
            unlocked() {return hasMilestone("mile", 8)}
        },
    },
    upgrades: {
        11: {
            title: "Challenging",
            description: "Unlock Challenges, and you can buy max Milestones.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade("coal", 25)},
        },
        12: {
            title: "Another 10 Later",
            description: "Unlock the 4th row of Coal Upgrades and Coal Buyables.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("mile", 11)},
        },
        13: {
            title: "More Ores",
            description: "Unlock 2 new layers: Lead and Iron.",
            cost: new Decimal(40),
            unlocked() {return hasUpgrade("mile", 12)},
        },
    },
    challenges: {
        11: {
            name: "Anti-Upgrade",
            challengeDescription: "When you Start a challenge, you do a Milestone reset, and get a debuff. You must reach a goal in order to finish the challenge, but can leave at any time. This one's debuff is quite simple, raise point gain to 0.1.",
            completionLimit: 10,
            goalDescription() {
                const completions = player[this.layer].challenges[this.id] || 0;
                let scaling = hasMilestone("mile", 7) ? 2.4 : 3; // Reduced scaling with milestone 7
                const goal = new Decimal(1000).times(Decimal.pow(scaling, completions));
                return `${format(goal)} points (Completed: ${completions}/${this.completionLimit})`;
            },
            canComplete() {
                const completions = player[this.layer].challenges[this.id] || 0;
                let scaling = hasMilestone("mile", 7) ? 2.4 : 3; // Match the scaling here too
                const goal = new Decimal(1000).times(Decimal.pow(scaling, completions));
                return player.points.gte(goal);
            },
            rewardDescription() {
                const completions = player[this.layer].challenges[this.id] || 0;
                const boost = completions * 3;
                return `Point & Stone gain ${boost+1}x (applied after challenge debuff)`;
            },
            rewardEffect() {
                const completions = player[this.layer].challenges[this.id] || 0;
                return new Decimal(1 + (completions * 3));
            },
        },
        12: {
            name: "Unbuyable",
            challengeDescription: "You can't unlock buyables.",
            completionLimit: 35,
            goalDescription() {
                const completions = player[this.layer].challenges[this.id] || 0;
                let scaling = 2; // Reduced scaling with milestone 7
                const goal = new Decimal(1e23).div(buyableEffect("coal", 12)).times(Decimal.pow(scaling, completions));
                return `${format(goal)} points (Completed: ${completions}/${this.completionLimit})`;
            },
            canComplete() {
                const completions = player[this.layer].challenges[this.id] || 0;
                let scaling = 2; // Match the scaling here too
                const goal = new Decimal(1e23).div(buyableEffect("coal", 12)).times(Decimal.pow(scaling, completions));
                return player.points.gte(goal);
            },
            rewardDescription() {
                const completions = player[this.layer].challenges[this.id] || 0;
                const boost = completions * 2;
                return `MileStone, Coal, Stone and Point gain ${boost+1}x (applied after challenge debuff)`;
            },
            rewardEffect() {
                const completions = player[this.layer].challenges[this.id] || 0;
                return new Decimal(1 + (completions * 3));
            },
            unlocked() {return maxedChallenge("mile", 11)}
        },
    },
    
    
    
    layerShown(){
        let isUnlocked = false
        if (hasUpgrade('stone', 55)){isUnlocked = true}
        if (hasAchievement('a', 25)){isUnlocked = true}
        return isUnlocked}
}),
addLayer("iron", {
    name: "Iron", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#cccccc",
    requires: new Decimal(1e30), // Can be a function that takes requirement increases into account
    resource: "iron", // Name of prestige currency
    baseResource: "coal", // Name of resource prestige is based on
    baseAmount() {return player.coal.points}, // Get the current amount of baseResource
    branches: ["coal"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    resetDescription: "Convert your coal to ",
    hotkeys: [
        {key: "i", description: "I: Reset for iron", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", ["display-text", "This is your first big choice. Choosing Iron will increase the base requirement for Lead resets. The Iron layer is more open, focusing on expanding the first 3 layers and better boosts."], "blank", "upgrades", "buyables"]
        },
    },
    upgrades:{
    },
    buyables: {
    },
    milestones: {
    },
    layerShown(){return (hasUpgrade('mile', 13))},
})
addLayer("lead", {
    name: "Lead", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#7a8a8f",
    requires: new Decimal(1e30), // Can be a function that takes requirement increases into account
    resource: "lead", // Name of prestige currency  
    baseResource: "coal", // Name of resource prestige is based on
    baseAmount() {return player.coal.points}, // Get the current amount of baseResource
    branches: ["coal"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    resetDescription: "Convert your coal to ",
    hotkeys: [
        {key: "l", description: "L: Reset for lead", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", ["display-text", "This is your first big choice. Choosing Lead will increase the base requirement for Iron resets. The Lead layer is more self contained, focusing on new content within Lead and QOL for the first 3 layers."], "blank", "upgrades", "buyables"]
        },
    },
    upgrades:{
    },
    buyables: {
    },
    milestones: {
    },
    layerShown(){return (hasUpgrade('mile', 13))},
})