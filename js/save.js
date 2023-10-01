(function(window) {

    window.save = async function(iid, data) {
        if(typeof iid === "undefined") {
            iid = "";
        }
        let saveData = JSON.stringify({id: iid, state: JSON.stringify(data, undefined, 4)}, undefined, 4);
        await fetch('./save/save.php', {
            method: 'POST',
            body: saveData
        });
    }

    window.get = async function(iid) {
        if(typeof iid === "undefined") {
            iid = "";
        }
        let saveData = JSON.stringify({id: iid});
        const response = await fetch('./save/get.php', {
            method: 'POST',
            body: saveData
        });
        try {
            return await response.json();
        }
        catch (error) {
            return {};
        }
    }
    
    window.send = function(iid, func, name) {
        window.socket.send('{"id":"'+iid+'","func":"'+func+'","name":"'+name+'"}');
        window.start = Date.now();
        window.socket.send('ping');
    }
    
    // Create WebSocket connection.
    window.socket = new WebSocket(window.socketUrl);

    window.getSpoiler = async function(iid) {
        let myiid = "("+iid+"1)";
        let spoiler = {};
        const locationsRes = await fetch('./static/locations.json', {
            method: 'GET'
        });
        let locationToIds = await locationsRes.json();
        const itemRes = await fetch('./static/items.json', {
            method: 'GET'
        });
        let itemsToIds = await itemRes.json();
        // hard coded... we could prompt a user in the future
        const spoilerRes = await fetch('./static/spoiler.txt', {
            method: 'GET'
        });
        let spoilerStr = await spoilerRes.text();
        let spoilerLines = spoilerStr.split(/\r\n|\r|\n/);
        let islocationsLinePassed = false;
        for(let line of spoilerLines) {
            if(islocationsLinePassed) {
                if(line != "") {
                    if(line == "Playthrough:" || line == "Shops:" || line == "Medallions:" || line == "Entrances:") {
                        islocationsLinePassed = false;
                    }
                    // Exculde locations that don't give items but "story" progress
                    else if(
                            !line.includes("Agahnim ") && 
                            !line.includes("Prize") && 
                            !line.includes("Ganon ") && 
                            !line.includes("Missing Smith ") &&
                            !line.includes("Open Floodgate") &&
                            !line.includes("Pick Up Purple Chest") &&
                            !line.includes("Get Frog") &&
                            !line.includes("Activated Flute")) {
                        let locItemCouple = line.split(": ");
                        if(locItemCouple[0].includes(myiid) || !locItemCouple[0].includes("1)")) {
                            let loc = locItemCouple[0].split(" (")[0];
                            let item = locItemCouple[1].split(" (")[0];
                            let itemId = itemsToIds[item];
                            if(itemId && !(locItemCouple[1].includes(iid) || !locItemCouple[1].includes("1)"))) {
                                itemId = "no-op";
                            }
                            spoiler[parseInt(locationToIds[loc], 16)] = itemId;
                        }
                    }
                }
            }
            if(line === "Locations:") {
                islocationsLinePassed = true;
            }
        }
        return spoiler;
    }
    
}(window));