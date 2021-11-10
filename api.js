const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
function sendJSON(url, obj, onresponse)
{
    // Sending and receiving data in JSON format using POST method
    //
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            onresponse(json);
        }
    };
    var data = JSON.stringify(obj);
    xhr.send(data);
}

function sendJSONBearer(url, obj, bearer, onresponse)
{
    if (!bearer) 
    {
        console.log("bearer is", bearer);
        return;
    }

    // Sending and receiving data in JSON format using POST method
    //
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer ' + bearer)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            onresponse(json);
        }
    };
    var data = JSON.stringify(obj);
    xhr.send(data);
}