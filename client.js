"use strict";


ready(function() {

    console.log("Client script loaded.");

    function ajaxGET(url, callback) {

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                console.log('responseText:' + xhr.responseText);
                callback(this.responseText);

            } else {
                console.log(this.status);
            }
        }
        xhr.open("GET", url);
        xhr.send();
    }

    function ajaxPOST(url, callback, data) {

        let params = typeof data == 'string' ? data : Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&');
        console.log("params in ajaxPOST", params);

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                console.log('responseText:' + xhr.responseText);
                callback(this.responseText);

            } else {
                console.log(this.status);
            }
        }
        xhr.open("POST", url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }

    // SEND TO THE SERVER       
    document.querySelector("login_button").addEventListener("click", function(e) {
        e.preventDefault();
        let email = document.getElementById("user_box");
        let password = document.getElementById("pwd_box");
        let queryString = "username=" + email.value + "&password=" + password.value;
        console.log("data that we will send", email.value, password.value);

        // ajaxPOST("/login", function(data) {                              // post using this line
        ajaxGET("/login?"+queryString, function(data){                      //get using this line
            if(data) {
                let dataParsed = JSON.parse(data);
                console.log(dataParsed);
                if(dataParsed.status == "fail") {
                    document.getElementById("errMsg").innerHTML = dataParsed.msg;
                } else {
                    window.location.replace("/profile");
                }
            }
            document.getElementById("errMsg").innerHTML = dataParsed.msg;

        // }, queryString);  //post using this
        
        });                  //get using this
    });




});

function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        console.log("Listener was invoked");
    }
}
