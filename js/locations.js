(function(window) {
    'use strict';

    function always() { return 'available'; }

    var dungeons = {
        eastern: {
            caption: 'Eastern Palace {lantern}',
            chest_limit: 3,
            is_completable: function(items) {
                return items.has_bow() ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            },
            is_progressable: function(items) {
                return this.chests <= 2 && !items.lantern ||
                    this.chests === 1 && !items.has_bow() ?
                    'possible' : 'available';
            },
            checks: [1573200, 59827, 59893, 59767, 59833, 59773]
        },
        desert: {
            caption: 'Desert Palace',
            chest_limit: 2,
            is_completable: function(items) {
                if (!(items.has_melee_bow() || items.has_cane() || items.has_rod())) return 'unavailable';
                if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (!items.lantern && !items.firerod) return 'unavailable';
                return items.boots ? 'available' : 'possible';
            },
            is_progressable: function(items) {
                if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (items.glove && (items.firerod || items.lantern) && items.boots) return 'available';
                return this.chests > 1 && items.boots ? 'available' : 'possible';
            },
            checks: [1573216, 59842, 59851, 59791, 1573201, 59830]
        },
        hera: {
            caption: 'Tower of Hera',
            chest_limit: 2,
            is_completable: function(items) {
                if (!items.has_melee()) return 'unavailable';
                return this.is_progressable(items);
            },
            is_progressable: function(items) {
                if (!items.flute && !items.glove) return 'unavailable';
                if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
                return items.firerod || items.lantern ?
                    items.flute || items.lantern ? 'available' : 'dark' :
                    'possible';
            },
            checks: [1573218, 59878, 59821, 1573202, 59896, 59899]
        },
        darkness: {
            caption: 'Palace of Darkness {lantern}',
            darkworld: true,
            chest_limit: 5,
            is_completable: function(items) {
                if (!items.moonpearl || !items.has_bow() || !items.hammer) return 'unavailable';
                if (!items.agahnim && !items.glove) return 'unavailable';
                return items.lantern ? 'available' : 'dark';
            },
            is_progressable: function(items) {
                if (!items.moonpearl) return 'unavailable';
                if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
                return !(items.has_bow() && items.lantern) ||
                    this.chests === 1 && !items.hammer ?
                    'possible' : 'available';
            },
            checks: [59968, 59971, 59974, 59977, 59980, 59983, 59986, 1573203, 59989, 59959, 59992, 59962, 59995, 59965]
        },
        swamp: {
            caption: 'Swamp Palace {mirror}',
            darkworld: true,
            chest_limit: 6,
            is_completable: function(items) {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!items.hammer || !items.hookshot) return 'unavailable';
                if (!items.glove && !items.agahnim) return 'unavailable';
                return 'available';
            },
            is_progressable: function(items) {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!items.can_reach_outcast() && !(items.agahnim && items.hammer)) return 'unavailable';

                if (this.chests <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : 'available';
                if (this.chests <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : 'available';
                if (this.chests <= 5) return !items.hammer ? 'unavailable' : 'available';
                return !items.hammer ? 'possible' : 'available';
            },
            checks: [60064, 60067, 60070, 59782, 59785, 60073, 60076, 60079, 1573204, 60061]
        },
        skull: {
            caption: 'Skull Woods',
            darkworld: true,
            chest_limit: 2,
            is_completable: function(items) {
                return !items.can_reach_outcast() || !items.firerod || !items.sword ? 'unavailable' : 'available';
            },
            is_progressable: function(items) {
                if (!items.can_reach_outcast()) return 'unavailable';
                return items.firerod ? 'available' : 'possible';
            },
            checks: [59809, 59902, 59848, 59794, 1573205, 59800, 59803, 59806]
        },
        thieves: {
            caption: 'Thieves\' Town',
            darkworld: true,
            chest_limit: 4,
            is_completable: function(items) {
                if (!(items.has_melee() || items.has_cane())) return 'unavailable';
                if (!items.can_reach_outcast()) return 'unavailable';
                return 'available';
            },
            is_progressable: function(items) {
                if (!items.can_reach_outcast()) return 'unavailable';
                return this.chests === 1 && !items.hammer ? 'possible' : 'available';
            },
            checks: [59905, 59908, 59911, 59914, 59917, 59920, 59923, 1573206]
        },
        ice: {
            caption: 'Ice Palace (yellow=must bomb jump)',
            darkworld: true,
            chest_limit: 3,
            is_completable: function(items) {
                if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                return items.hookshot || items.somaria ? 'available' : 'possible';
            },
            is_progressable: function(items) {
                if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                return items.hammer ? 'available' : 'possible';
            },
            checks: [59872, 59875, 59812, 59818, 59860, 59797, 1573207, 59869]
        },
        mire: {
            caption: medallion_caption('Misery Mire {medallion}{lantern}', 'mire'),
            darkworld: true,
            chest_limit: 2,
            is_completable: function(items) {
                if (!items.has_melee_bow()) return 'unavailable';
                if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = items.medallion_check(this.medallion);
                if (state) return state;

                return items.lantern || items.firerod ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            },
            is_progressable: function(items) {
                if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = items.medallion_check(this.medallion);
                if (state) return state;

                return (this.chests > 1 ?
                    items.lantern || items.firerod :
                    items.lantern && items.somaria) ?
                    'available' : 'possible';
            },
            checks: [60001, 60004, 60007, 60010, 60013, 1573208, 59866, 59998]
        },
        turtle: {
            caption: medallion_caption('Turtle Rock {medallion}{lantern}', 'turtle'),
            darkworld: true,
            chest_limit: 5,
            is_completable: function(items) {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                if (!items.icerod || !items.firerod) return 'unavailable';
                var state = items.medallion_check(this.medallion);
                if (state) return state;

                return items.byrna || items.cape || items.shield === 3 ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            },
            is_progressable: function(items) {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                var state = items.medallion_check(this.medallion);
                if (state) return state;

                var laser_safety = items.byrna || items.cape || items.shield === 3,
                    dark_room = items.lantern ? 'available' : 'dark';
                if (this.chests <= 1) return !laser_safety ? 'unavailable' : items.firerod && items.icerod ? dark_room : 'possible';
                if (this.chests <= 2) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
                if (this.chests <= 4) return laser_safety && items.firerod && items.lantern ? 'available' : 'possible';
                return items.firerod && items.lantern ? 'available' : 'possible';
            },
            checks: [59938, 59941, 59944, 1573209, 59947, 59950, 59953, 59956, 59926, 59929, 59932, 59935]
        }
    };

    var encounters = {
        agahnim: {
            caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
            darkworld: false,
            is_completable: function(items, model) {
                return items.sword >= 2 || items.cape && items.sword ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: []
        },
        tower: {
            caption: 'Ganon\s Tower (20)',
            darkworld: true,
            chests: 20,
            chest_limit: 20,
            is_completable: function(items, model) {
                if (!items.moonpearl || !items.hammer || items.glove !== 2) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                
                var crystal_count = Object.keys(model.dungeons).reduce(function(s, name) {
                    var dungeon = model.dungeons[name];
                    return (dungeon.prize === 3 || dungeon.prize === 4) && dungeon.completed ? s + 1 : s;
                }, 0);
                return crystal_count >= 7 ? 'available' : 'unavailable';
            },
            checks: [60160, 60163, 60166, 60088, 60091, 60094, 60097, 60100, 60103, 60106, 60109, 60112, 60115, 60118,
                     60121, 60124, 60127, 1573217, 60130, 60133, 60136, 60139, 60142, 60145, 60148, 60151, 60157]
        }
    };

    var chests = {
        altar: {
            caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
            is_available: function(items, model) {
                var pendant_count = Object.keys(model.dungeons).reduce(function(s, name) {
                    var dungeon = model.dungeons[name];
                    return [1,2].includes(dungeon.prize) && dungeon.completed ? s + 1 : s;
                }, 0);

                return pendant_count >= 3 ? 'available' :
                    items.book ? 'possible' : 'unavailable';
            },
            checks: [166320]
        },
        mushroom: {
            caption: 'Mushroom',
            is_available: always,
            checks: [1572883]
        },
        hideout: {
            caption: 'Forest Hideout',
            is_available: always,
            checks: [1572864]
        },
        tree: {
            caption: 'Lumberjack Tree {agahnim}{boots}',
            is_available: function(items) {
                return items.agahnim && items.boots ? 'available' : 'possible';
            },
            checks: [1572865]
        },
        lost_man: {
            caption: 'Lost Old Man {lantern}',
            is_available: function(items) {
                return items.glove || items.flute ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [1010170]
        },
        spectacle_cave: {
            caption: 'Spectacle Rock Cave',
            is_available: function(items) {
                return items.glove || items.flute ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [1572866]
        },
        spectacle_rock: {
            caption: 'Spectacle Rock {mirror}',
            is_available: function(items) {
                return items.glove || items.flute ?
                    items.mirror ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            },
            checks: [1573184]
        },
        ether: {
            caption: 'Ether Tablet {sword2}{book}',
            is_available: function(items) {
                return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
                    items.sword >= 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            },
            checks: [1572886]
        },
        paradox: {
            caption: 'Death Mountain East (5 + 2 {bomb})',
            is_available: function(items) {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [60202, 60205, 60208, 60211, 60214, 60217, 60220]
        },
        spiral: {
            caption: 'Spiral Cave',
            is_available: function(items) {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [59839]
        },
        island_dm: {
            caption: 'Floating Island {mirror}',
            is_available: function(items) {
                return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
                    items.mirror && items.moonpearl && items.glove === 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            },
            checks: [1573185]
        },
        mimic: {
            caption: medallion_caption('Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion} unkown OR possible w/out {firerod})', 'turtle'),
            is_available: function(items, model) {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
                var state = items.medallion_check(model.dungeons.turtle.medallion);
                if (state) return state;

                return items.firerod ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible';
            },
            checks: [59845]
        },
        graveyard_w: {
            caption: 'West of Sanctuary {boots}',
            is_available: function(items) {
                return items.boots ? 'available' : 'unavailable';
            },
            checks: [0xeb3f]
        },
        graveyard_n: {
            caption: 'Graveyard Cliff Cave {mirror}',
            is_available: function(items) {
                return items.can_reach_outcast() && items.mirror ? 'available' : 'unavailable';
            },
            checks: [1572868]
        },
        graveyard_e: {
            caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
            is_available: function(items) {
                if (!items.boots) return 'unavailable';
                if (items.can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
                return 'unavailable';
            },
            checks: [59770]
        },
        witch: {
            caption: 'Witch: Give her {mushroom}',
            is_available: function(items) {
                return items.mushroom ? 'available' : 'unavailable';
            },
            checks: [1572884]
        },
        fairy_lw: {
            caption: 'Waterfall of Wishing (2) {flippers}',
            is_available: function(items) {
                return items.flippers ? 'available' : 'unavailable';
            },
            checks: [59824, 59857]
        },
        zora: {
            caption: 'King Zora: Pay 500 rupees',
            is_available: function(items) {
                return items.flippers || items.glove ? 'available' : 'unavailable';
            },
            checks: [975299]
        },
        river: {
            caption: 'Zora River Ledge {flippers}',
            is_available: function(items) {
                return items.flippers ? 'available' :
                    items.glove ? 'possible' :
                    'unavailable';
            },
            checks: [1573193]
        },
        well: {
            caption: 'Kakariko Well (4 + {bomb})',
            is_available: always,
            checks: [60046, 60049, 60052, 60055, 60058]
        },
        thief_hut: {
            caption: 'Thieve\'s Hut (4 + {bomb})',
            is_available: always,
            checks: [60175, 60178, 60181, 60184, 60187]
        },
        bottle: {
            caption: 'Bottle Vendor: Pay 100 rupees',
            is_available: always,
            checks: [191256]
        },
        chicken: {
            caption: 'Chicken House {bomb}',
            is_available: always,
            checks: [59881]
        },
        kid: {
            caption: 'Dying Boy: Distract him with {bottle} so that you can rob his family!',
            is_available: function(items) {
                return items.bottle ? 'available' : 'unavailable';
            },
            checks: [211407]
        },
        tavern: {
            caption: 'Tavern',
            is_available: always,
            checks: [59854]
        },
        frog: {
            caption: 'Take the frog home {mirror} / Save+Quit',
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            },
            checks: [1572906]
        },
        bat: {
            caption: 'Mad Batter {hammer}/{mirror} + {powder}',
            is_available: function(items) {
                return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
            },
            checks: [1572885]
        },
        sahasrahla_hut: {
            caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
            is_available: always,
            checks: [60034, 60037, 60040]
        },
        sahasrahla: {
            caption: 'Sahasrahla {pendant0}',
            is_available: function(items, model) {
                return Object.keys(model.dungeons).reduce(function(state, name) {
                    var dungeon = model.dungeons[name];
                    return dungeon.prize === 1 && dungeon.completed ? 'available' : state;
                }, 'unavailable');
            },
            checks: [193020]
        },
        maze: {
            caption: 'Race Minigame {bomb}/{boots}',
            is_available: always,
            checks: [1573186]
        },
        library: {
            caption: 'Library {boots}',
            is_available: function(items) {
                return items.boots ? 'available' : 'possible';
            },
            checks: [1572882]
        },
        dig_grove: {
            caption: 'Buried Itam {shovel}',
            is_available: function(items) {
                return items.shovel ? 'available' : 'unavailable';
            },
            checks: [1573194]
        },
        desert_w: {
            caption: 'Desert West Ledge {book}/{mirror}',
            is_available: function(items) {
                return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
            },
            checks: [1573187]
        },
        desert_ne: {
            caption: 'Checkerboard Cave {mirror}',
            is_available: function(items) {
                return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
            },
            checks: [1572869]
        },
        aginah: {
            caption: 'Aginah\'s Cave {bomb}',
            is_available: always,
            checks: [59890]
        },
        bombos: {
            caption: 'Bombos Tablet {mirror}{sword2}{book}',
            is_available: function(items) {
                return items.book && items.mirror && (items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ?
                    items.sword >= 2 ? 'available' : 'possible' :
                    'unavailable';
            },
            checks: [1572887]
        },
        grove_s: {
            caption: 'South of Grove {mirror}',
            is_available: function(items) {
                return items.mirror && (items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
            },
            checks: [1572867]
        },
        dam: {
            caption: 'Light World Swamp (2)',
            is_available: always,
            checks: [59788, 1573189]
        },
        lake_sw: {
            caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
            is_available: always,
            checks: [60226, 60229, 60232, 60235, 1572880]
        },
        ice_cave: {
            caption: 'Ice Rod Cave {bomb}',
            is_available: always,
            checks: [60238]
        },
        island_lake: {
            caption: 'Lake Hylia Island {mirror}',
            is_available: function(items) {
                return items.flippers ?
                    items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
                        'available' : 'possible' :
                    'unavailable';
            },
            checks: [1573188]
        },
        hobo: {
            caption: 'Fugitive under the bridge {flippers}',
            is_available: function(items) {
                return items.flippers ? 'available' : 'unavailable';
            },
            checks: [212605]
        },
        link_house: {
            caption: 'Stoops Lonk\'s Hoose',
            is_available: always,
            checks: [59836]
        },
        secret: {
            caption: "Castle Secret Entrance (Uncle + 1)",
            is_available: always,
            checks: [188229, 59761]
        },
        castle: {
            caption: 'Hyrule Castle Dungeon (3)',
            is_available: always,
            checks: [59764, 60172, 60169]
        },
        escape_dark: {
            caption: 'Escape Sewer Dark Room {lantern}',
            is_available: function(items) {
                return items.lantern ? 'available' : 'dark';
            },
            checks: [59758]
        },
        escape_side: {
            caption: 'Escape Sewer Side Room (3) {bomb}/{boots} (yellow = need small key)',
            is_available: function(items) {
                return items.glove ? 'available' :
                    items.lantern ? 'possible' : 'dark';
            },
            checks: [60253, 60256, 60259]
        },
        sanctuary: {
            caption: 'Sanctuary',
            is_available: always,
            checks: [60025]
        },
        bumper: {
            caption: 'Bumper Cave {cape}',
            darkworld: true,
            is_available: function(items) {
                return items.can_reach_outcast() ?
                    items.glove && items.cape ? 'available' : 'possible' :
                    'unavailable';
            },
            checks: [1573190]
        },
        spike: {
            caption: 'Byrna Spike Cave',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [60043]
        },
        bunny: {
            caption: 'Super Bunny Chests (2)',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [60028, 60031]
        },
        rock_hook: {
            caption: 'Cave Under Rock (3 top chests) {hookshot}',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && items.hookshot ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [60241, 60244, 60247]
        },
        rock_boots: {
            caption: 'Cave Under Rock (bottom chest) {hookshot}/{boots}',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            },
            checks: [60250]
        },
        catfish: {
            caption: 'Catfish',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
                    'available' : 'unavailable';
            },
            checks: [975237]
        },
        chest_game: {
            caption: 'Treasure Chest Minigame: Pay 30 rupees',
            darkworld: true,
            is_available: function(items) {
                return items.can_reach_outcast() ? 'available' : 'unavailable';
            },
            checks: [60840]
        },
        c_house: {
            caption: 'C House',
            darkworld: true,
            is_available: function(items) {
                return items.can_reach_outcast() ? 'available' : 'unavailable';
            },
            checks: [59887]
        },
        bomb_hut: {
            caption: 'Bombable Hut {bomb}',
            darkworld: true,
            is_available: function(items) {
                return items.can_reach_outcast() ? 'available' : 'unavailable';
            },
            checks: [59884]
        },
        purple: {
            caption: 'Gary\'s Lunchbox (save the frog first)',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            },
            checks: [212328]
        },
        pegs: {
            caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
            },
            checks: [1572870]
        },
        fairy_dw: {
            caption: 'Fat Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
            darkworld: true,
            is_available: function(items, model) {
                var crystal_count = Object.keys(model.dungeons).reduce(function(s, name) {
                    var dungeon = model.dungeons[name];
                    return dungeon.prize === 4 && dungeon.completed ? s + 1 : s;
                }, 0);

                if (crystal_count < 2 || !items.moonpearl) return 'unavailable';
                return items.hammer && (items.agahnim || items.glove) ||
                    items.agahnim && items.mirror && items.can_reach_outcast() ? 'available' : 'unavailable';
            },
            checks: [59776, 59779]
        },
        pyramid: {
            caption: 'Pyramid',
            darkworld: true,
            is_available: function(items) {
                return items.agahnim || items.glove && items.hammer && items.moonpearl ||
                    items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
            },
            checks: [1573191]
        },
        dig_game: {
            caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
            darkworld: true,
            is_available: function(items) {
                return items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            },
            checks: [1573192]
        },
        stumpy: {
            caption: 'Ol\' Stumpy',
            darkworld: true,
            is_available: function(items) {
                return items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            },
            checks: [209095]
        },
        swamp_ne: {
            caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
            darkworld: true,
            is_available: function(items) {
                return items.can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
            },
            checks: [60190, 60193, 60196, 60199, 1572881]
        },
        mire_w: {
            caption: 'West of Mire (2)',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
            },
            checks: [60019, 60022]
        }
    };

    var standard_chests = update(chests, {
        escape_dark: { $merge: {is_available: always} },
        escape_side: { $merge: {
            caption: 'Escape Sewer Side Room (3) {bomb}/{boots}',
            is_available: always
        } }
    });

    function medallion_caption(caption, name) {
        return function(model) {
            var value = model.dungeons[name].medallion;
            return caption.replace('{medallion}', '{medallion'+value+'}');
        };
    }

    dungeons = finalize_dungeons(dungeons,
        function(dungeon) { return update(dungeon, { $merge: { chests: dungeon.chest_limit } }); });

    function finalize_dungeons(dungeons, apply) {
        return update(map_values(dungeons, function(d) { return create(d); }), {
            eastern:  { $apply: apply, $merge: { completed: false, prize: 0 } },
            desert:   { $apply: apply, $merge: { completed: false, prize: 0 } },
            hera:     { $apply: apply, $merge: { completed: false, prize: 0 } },
            darkness: { $apply: apply, $merge: { completed: false, prize: 0 } },
            swamp:    { $apply: apply, $merge: { completed: false, prize: 0 } },
            skull:    { $apply: apply, $merge: { completed: false, prize: 0 } },
            thieves:  { $apply: apply, $merge: { completed: false, prize: 0 } },
            ice:      { $apply: apply, $merge: { completed: false, prize: 0 } },
            mire:     { $apply: apply, $merge: { completed: false, prize: 0, medallion: 0 } },
            turtle:   { $apply: apply, $merge: { completed: false, prize: 0, medallion: 0 } },
        });
    }

    let standard_dungeons = prologue_dungeons(dungeons);
    let standard_encounters = prologue_encounters(encounters);
    standard_chests = prologue_chests(standard_chests);

    chests = finalize_chests(chests);
    standard_chests = finalize_chests(standard_chests);

    function finalize_chests(chests) {
        return map_values(chests, function(chest) {
            return create(chest, { marked: chest.marked || false });
        });
    }

    function prologue_dungeons(dungeons) {
        let result = {}
        for (const [key, value] of Object.entries(dungeons)) {
            result[key] = {};
            Object.assign(result[key], { 
                completed: value.completed, 
                prize: value.prize, 
                medallion: value.medallion, 
                caption: value.caption,
                chest_limit: value.chest_limit,
                chests: value.chests,
                darkworld: value.darkworld
            });
            Object.assign(result[key], { is_completable: function(items, model) {
                if(!model.chests.sanctuary.marked) {
                    return 'unavailable';
                }
                return value.is_completable(items, model);
            }});
            Object.assign(result[key], { is_progressable: function(items, model) {
                if(!model.chests.sanctuary.marked) {
                    return 'unavailable';
                }
                return value.is_progressable(items, model);
            }});
        }
        return result;
    }

    function prologue_encounters(encounters) {
        let result = {};
        for (const [key, value] of Object.entries(encounters)) {
            result[key] = {};
            Object.assign(result[key], { 
                caption: value.caption, 
                darkworld: value.darkworld, 
                chests: value.chests, 
                chest_limit: value.chest_limit
            });
            Object.assign(result[key], { is_completable: function(items, model) {
                if(!model.chests.sanctuary.marked) {
                    return 'unavailable';
                }
                return value.is_completable(items, model);
            }});
        }
        return result;
    }

    function prologue_chests(chests) {
        let result = {};
        let prologueable = ['link_house', 'secret', 'castle', 'escape_dark', 'escape_side', 'sanctuary'];
        for (const [key, value] of Object.entries(chests)) {
            result[key] = {};
            Object.assign(result[key], { 
                caption: value.caption, 
                darkworld: value.darkworld
            });
            Object.assign(result[key], { is_available: function(items, model) {
                if(!prologueable.includes(key)) {
                    if(!model.chests.sanctuary.marked) {
                        return 'unavailable';
                    }
                }
                return value.is_available(items, model);
            }});
        }
        return result;
    }

    window.location_model = function(mode) {
        return {
            dungeons: { standard: standard_dungeons, open: dungeons }[mode],
            encounters: { standard: standard_encounters, open: encounters }[mode],
            chests: { standard: standard_chests, open: chests }[mode]
        };
    };
    
    window.getCheckFromMemId = function(memId) {
        let check = {
            isComplete: false,
            func: null,
            name: null
        };
            
        for (const [key, value] of Object.entries(dungeons)) {
            if(value.checks.includes(memId)) {
                if(memId > 1573199) {
                    if(memId !== 1573216 && memId !== 1573218) {
                        check.isComplete = true;
                        check.func = "boss_click";
                        check.name = key;
                    }
                }
                return check;
            }
        }
        for (const [key, value] of Object.entries(encounters)) {
            if(value.checks.includes(memId)) {
                return check;
            }
        }
        for (const [key, value] of Object.entries(chests)) {
            if(value.checks.includes(memId)) {
                check.func = "map_chest_click";
                check.name = key;
                value.checks.splice(value.checks.indexOf(memId), 1);
                if(value.checks.length < 1) {
                    check.isComplete = true;
                }
                return check;
            }
        }
        
        return check;
    }
}(window));
