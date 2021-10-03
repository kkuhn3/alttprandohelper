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
    window.socket = new WebSocket('ws://127.0.0.1:7979/alttprandohelper');

}(window));