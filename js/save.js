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
}(window));