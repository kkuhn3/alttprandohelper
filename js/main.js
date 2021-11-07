(function(window) {
    'use strict';

    var slice = Array.prototype.slice;

    var Item = function(props) {
        var name = props.name,
            value = props.value;
        return div('.item', {
            className: classNames(name,
                value === true ? 'active' :
                value > 0 ? 'active-'+value : null),
            onClick: function() { props.onClick(name); }
        });
    };

    var TunicItem = function(props) {
        var value = props.items.tunic,
            has_pearl = props.items.moonpearl;
        return div('.item.tunic', {
            className: classNames('active-'+value, { bunny: !has_pearl }),
            onClick: function() { props.onClick('tunic'); }
        });
    };

    var Dungeon = function(props) {
        var name = props.name,
            dungeon = props.value;
        return [
            div('.boss', {
                className: classNames(name, { defeated: dungeon.completed }),
                onClick: function() { props.onBossClick(name); }
            }),
            div('.prize', {
                className: 'prize-'+dungeon.prize,
                onClick: function() { props.onPrizeClick(name); }
            })
        ];
    };

    var WithMedallion = function(Wrapped) {
        return function(props) {
            var name = props.name,
                dungeon = props.value;
            return [
                t(Wrapped, props),
                div('.medallion', {
                    className: 'medallion-'+dungeon.medallion,
                    onClick: function() { props.onMedallionClick(name); }
                })
            ];
        };
    };

    var DungeonWithMedallion = WithMedallion(Dungeon);

    var Chest = function(props) {
        var name = props.name,
            dungeon = props.value;
        return div('.chest', {
            className: 'chest-'+dungeon.chests,
            onClick: function() { props.onClick(name); }
        });
    };
    
    var Counter = function(props) {
        var name = props.name,
            encounter = props.value;
        return div(
            '.counter', 
            {
                onClick: function() {props.onClick(name); }
            }, 
            encounter.chests
        );
    };

    var Tracker = createReactClass({
        render: function() {
            return div('#tracker', { className: classNames({ cell: this.props.horizontal })},
                grid([
                    grid([[
                        this.tunic(),
                        this.counter('tower'),
                        this.item('sword'),
                        this.item('shield'),
                        this.item('moonpearl'),
                    ]], [
                        this.dungeon('eastern'),
                        this.chest('eastern')
                    ], [
                        this.dungeon('desert'),
                        this.chest('desert')
                    ], [
                        this.dungeon('hera'),
                        this.chest('hera')
                    ]),
                    grid([
                        this.item('bow'),
                        this.item('boomerang'),
                        this.item('hookshot'),
                        this.item('mushroom'),
                        this.item('powder')
                    ], [
                        this.item('firerod'),
                        this.item('icerod'),
                        this.item('bombos'),
                        this.item('ether'),
                        this.item('quake')
                    ], [
                        this.item('lantern'),
                        this.item('hammer'),
                        this.item('shovel'),
                        this.item('net'),
                        this.item('book')
                    ], [
                        this.item('bottle'),
                        this.item('somaria'),
                        this.item('byrna'),
                        this.item('cape'),
                        this.item('mirror')
                    ], [
                        this.item('boots'),
                        this.item('glove'),
                        this.item('flippers'),
                        this.item('flute'),
                        this.item('agahnim')
                    ])
                ], [
                    this.dungeon('darkness'),
                    this.dungeon('swamp'),
                    this.dungeon('skull'),
                    this.dungeon('thieves'),
                    this.dungeon('ice'),
                    this.medallion_dungeon('mire'),
                    this.medallion_dungeon('turtle')
                ], [
                    this.chest('darkness'),
                    this.chest('swamp'),
                    this.chest('skull'),
                    this.chest('thieves'),
                    this.chest('ice'),
                    this.chest('mire'),
                    this.chest('turtle')
                ]));
        },

        tunic: function() {
            return t(TunicItem, { items: this.props.items, onClick: this.props.item_click });
        },

        item: function(name) {
            return t(Item, { name: name, value: this.props.items[name], onClick: this.props.item_click });
        },

        dungeon: function(name) {
            return t(Dungeon, {
                name: name,
                value: this.props.dungeons[name],
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click });
        },

        medallion_dungeon: function(name) {
            return t(DungeonWithMedallion, {
                name: name,
                value: this.props.dungeons[name],
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click,
                onMedallionClick: this.props.medallion_click });
        },

        chest: function(name) {
            return t(Chest, { name: name, value: this.props.dungeons[name], onClick: this.props.chest_click });
        },
        
        counter: function(name) {
            return t(Counter, { name: name, value: this.props.encounters[name], onClick: this.props.tower_chest_click });
        }
    });

    function WithHighlight(Wrapped, source) {
        return createReactClass({
            getInitialState: function() {
                return { highlighted: false };
            },

            render: function() {
                return t(Wrapped, Object.assign({
                        highlighted: this.state.highlighted,
                        onHighlight: this.onHighlight
                    }, this.props));
            },

            onHighlight: function(highlighted) {
                var name = this.props.name,
                    model = this.props.model,
                    location = model[source][name];
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption(model) : location.caption :
                    null);
                this.setState({ highlighted: highlighted });
            }
        });
    }

    var MapChest = function(props) {
        var name = props.name,
            model = props.model,
            chest = model.chests[name];
        return div('.chest', {
            className: classNames(
                as_location(name),
                chest.marked || chest.is_available(model.items, model), {
                    marked: chest.marked,
                    highlight: props.highlighted
                }),
            onClick: function() { props.onClick(name) },
            onMouseOver: function() { props.onHighlight(true); },
            onMouseOut: function() { props.onHighlight(false); }
        });
    };

    var MapEncounter = function(props) {
        var name = props.name,
            model = props.model,
            encounter = model.encounters[name],
            completed = model.items[name] || encounter.chests === 0;
        return [
            div('.boss', {
                className: as_location(name),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            }),
            div('.encounter', {
                className: classNames(
                    as_location(name),
                    completed || encounter.is_completable(model.items, model), {
                        marked: completed,
                        highlight: props.highlighted
                    }),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            })
        ];
    };

    var MapDungeon = function(props) {
        var name = props.name,
            model = props.model,
            dungeon = model.dungeons[name];
        return [
            div('.boss', {
                className: classNames(
                    as_location(name),
                    dungeon.completed || dungeon.is_completable(model.items, model),
                    { marked: dungeon.completed }),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            }),
            div('.dungeon', {
                className: classNames(
                    as_location(name),
                    dungeon.chests === 0 || dungeon.is_progressable(model.items, model), {
                        marked: dungeon.chests === 0,
                        highlight: props.highlighted
                    }),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            })
        ];
    };

    var MapChestWithHighlight = WithHighlight(MapChest, 'chests'),
        MapEncounterWithHighlight = WithHighlight(MapEncounter, 'encounters'),
        MapDungeonWithHighlight = WithHighlight(MapDungeon, 'dungeons');

    var Caption = createReactClass({
        render: function() {
            var each_part = /[^{]+|\{[\w]+\}/g,
                text = this.props.text;
            return div('#caption', !text ? '\u00a0' : text.match(each_part).map(this.parse));
        },

        parse: function(part) {
            var dm = part.match(/^\{(medallion|pendant)(\d+)\}/),
                pm = part.match(/^\{(\w+?)(\d+)?\}/),
                m = dm || pm;
            return !m ? part : div('.icon', { className: dm ?
                m[1]+'-'+m[2] :
                classNames(m[1], m[2] && 'active-'+m[2])
            });
        }
    });

    var Map = createReactClass({
        getInitialState: function() {
            return { caption: null };
        },

        render: function() {
            var model = this.props,
                chest_click = this.props.chest_click,
                change_caption = this.change_caption;

            var locations = partition(flatten([
                    map(model.chests, function(chest, name) {
                        return { darkworld: chest.darkworld,
                            tag: t(MapChestWithHighlight, { name: name, model: model, onClick: chest_click, change_caption: change_caption }) };
                    }),
                    map(model.encounters, function(encounter, name) {
                        return { darkworld: encounter.darkworld,
                            tag: t(MapEncounterWithHighlight, { name: name, model: model, change_caption: change_caption }) };
                    }),
                    map(model.dungeons, function(dungeon, name) {
                        return { darkworld: dungeon.darkworld,
                            tag: t(MapDungeonWithHighlight, { name: name, model: model, change_caption: change_caption }) };
                    })
                ]), function(x) { return !x.darkworld; }),
                worlds = [
                    div('.world-light', locations[0].map(property('tag'))),
                    div('.world-dark', locations[1].map(property('tag')))
                ];

            return div('#map', { className: classNames({ cell: this.props.horizontal }) },
                this.props.horizontal ? grid.call(null, worlds) : worlds,
                t(Caption, { text: this.state.caption })
            );
        },

        change_caption: function(caption) {
            this.setState({ caption: caption });
        }
    });

    function grid(rows) {
        rows = slice.call(arguments);
        return rows.map(function(row) {
            return div('.row', row.map(function(cell) {
                return div('.cell', cell);
            }));
        });
    }

    var App = createReactClass({
        getInitialState: function() {
            var mode = this.props.query.mode;
            return Object.assign(item_model(mode), location_model(mode));
        },

        render: function() {
            var query = this.props.query;
            return div('#page', {
                    className: classNames({
                            row: query.hmap,
                            hmap: query.hmap,
                            vmap: query.vmap
                        },
                        query.scale && 'scale-'+query.scale,
                        query.sprite),
                    style: query.bg && { 'background-color': query.bg }
                },
                t(Tracker, Object.assign({
                    item_click: this.item_click,
                    boss_click: this.boss_click,
                    prize_click: this.prize_click,
                    medallion_click: this.medallion_click,
                    chest_click: this.chest_click,
                    tower_chest_click: this.tower_chest_click,
                    horizontal: query.hmap
                }, this.state)),
                (query.hmap || query.vmap) && t(Map, Object.assign({ chest_click: this.map_chest_click, horizontal: query.hmap }, this.state)));
        },

        componentDidMount: async function(){
            window.id = this.props.query.id;
            window.auto = this.props.query.auto;
            let loadState = await window.get(window.id);
            window.spoiler = await window.getSpoiler(window.id);
            for(const [statekey, statevalue] of Object.entries(loadState)) {
                if(statekey === "chests") {
                    for(const [key, value] of Object.entries(loadState["chests"])) {
                        this.setState(update(this.state, { chests: at(key, { marked: { $set: value.marked } }) }));
                    }
                }
                else if(statekey === "dungeons") {
                    for(const [key, value] of Object.entries(loadState["dungeons"])) {
                        this.setState(update(this.state, { dungeons: at(key, { chests: { $set: value.chests } }) }));
                        this.setState(update(this.state, { dungeons: at(key, { completed: { $set: value.completed } }) }));
                        this.setState(update(this.state, { dungeons: at(key, { prize: { $set: value.prize } }) }));
                        this.setState(update(this.state, { dungeons: at(key, { medallion: { $set: value.medallion } }) }));
                    }
                }
                else if(statekey === "encounters") {
                    for(const [key, value] of Object.entries(loadState["encounters"])) {
                        this.setState(update(this.state, { encounters: at(key, { chest_limit: { $set: value.chest_limit } }) }));
                        this.setState(update(this.state, { encounters: at(key, { chests: { $set: value.chests } }) }));
                    }
                }
                else if(statekey === "items") {
                    for(const [key, value] of Object.entries(loadState["items"])) {
                        this.setState(update(this.state, { items: at(key, { $set: value }) }));
                    }
                }
            }
            
            // Connection opened
            window.socket.addEventListener('open', function (event) {});
            
            // Listen for messages
            window.socket.addEventListener('message', function (event) {
                console.log(event.data);
                if(event.data === "pong") {
                    let end = Date.now();
                    let delta = end - window.start;
                    let loPings = [];
                    if(localStorage.getItem('kpow2Pings') != null){
                        loPings = JSON.parse(localStorage.getItem('kpow2Pings'));
                    }
                    loPings.push(delta);
                    localStorage.setItem("kpow2Pings", JSON.stringify(loPings));
                }
                else {
                    let msgObj = JSON.parse(event.data);
                    if(Array.isArray(msgObj) && window.auto) {
                        for(const [k, msg] of Object.entries(msgObj)) {
                            if(msg.locations) {
                                for(const [kk, memId] of Object.entries(msg.locations)) {
                                    let checks = window.getCheckFromMemId(memId);
                                    for(let check of checks) {
                                        this[check.func](check.name, true);
                                    }
                                    let item = window.spoiler[memId];
                                    if(item && item !== "no-op") {
                                        this["item_click"](item, true);
                                    }
                                }
                            }
                        }
                    }
                    else if(msgObj.id === window.id || msgObj.id === typeof window.id) {
                        this[msgObj.func](msgObj.name, true);
                    }
                }
            }.bind(this))
        },

        item_click: async function(name, isRepeat) {
            var items = this.state.items,
                change = typeof items[name] === 'boolean' ?
                    { $toggle: [name] } :
                    at(name, { $set: items.inc(name) });
            await this.setState(update(this.state, { items: change }));
            if(!isRepeat) {
                await window.save(this.props.query.id, this.state);
                window.send(this.props.query.id, "item_click", name);
            }
        },

        boss_click: async function(name, isRepeat) {
            await this.setState(update(this.state, { dungeons: at(name, { $toggle: ['completed'] }) }));
            if(!isRepeat) {
                await window.save(this.props.query.id, this.state);
                window.send(this.props.query.id, "boss_click", name);
            }
        },

        prize_click: async function(name, isRepeat) {
            var value = counter(this.state.dungeons[name].prize, 1, 4);
            await this.setState(update(this.state, { dungeons: at(name, { prize: { $set: value } }) }));
            if(!isRepeat) {
                await window.save(this.props.query.id, this.state);
                window.send(this.props.query.id, "prize_click", name);
            }
        },

        medallion_click: async function(name, isRepeat) {
            var value = counter(this.state.dungeons[name].medallion, 1, 3);
            await this.setState(update(this.state, { dungeons: at(name, { medallion: { $set: value } }) }));
            if(!isRepeat) {
                await window.save(this.props.query.id, this.state);
                window.send(this.props.query.id, "medallion_click", name);
            }
        },

        chest_click: async function(name, isRepeat) {
            var dungeon = this.state.dungeons[name],
                value = counter(dungeon.chests, -1, dungeon.chest_limit);
            await this.setState(update(this.state, { dungeons: at(name, { chests: { $set: value } }) }));
            if(!isRepeat) {
                await window.save(this.props.query.id, this.state);
                window.send(this.props.query.id, "chest_click", name);
            }
        },

        map_chest_click: async function(name, isRepeat) {
            await this.setState(update(this.state, { chests: at(name, { $toggle: ['marked'] }) }));
            if(!isRepeat) {
                await window.save(this.props.query.id, this.state);
                window.send(this.props.query.id, "map_chest_click", name);
            }
        },
        
        tower_chest_click: async function(name, isRepeat) {
            var encounter = this.state.encounters[name],
                value = counter(encounter.chests, -1, encounter.chest_limit);
            await this.setState(update(this.state, { encounters: at(name, { chests: { $set: value } }) }));
            if(!isRepeat) {
                await window.save(this.props.query.id, this.state);
                window.send(this.props.query.id, "tower_chest_click", name);
            }
        }
    });

    window.start = function() {
        ReactDOM.render(t(App, { query: uri_query() }), document.getElementById('app'));
    };

    function as_location(s) {
        return s.replace(/_/, '-');
    }
}(window));
