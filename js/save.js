(function(window) {

    window.save = async function(iid, data) {
        let saveData = JSON.stringify({id: iid, state: JSON.stringify(data, undefined, 4)}, undefined, 4);
        await fetch('./save/save.php', {
            method: 'POST',
            body: saveData
        });
    }

    window.get = async function(id) {
        let saveData = JSON.stringify({id: id});
        const response = await fetch('./save/get.php', {
            method: 'POST',
            body: saveData
        });
        return response.json();
    }

}(window));