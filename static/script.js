function sendMessage(message) {
    let xhr = new XMLHttpRequest();
    let url = "/api/prompt";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Print received data from server
            console.log(this.responseText);
        }
    };

    let data = JSON.stringify({"prompt": message});
    xhr.send(data);
}