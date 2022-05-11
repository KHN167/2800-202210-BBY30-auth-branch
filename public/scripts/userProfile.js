var currentUser;

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userPassword = userDoc.data().password;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("username").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("password").value = userSchool;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run
populateInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('info').disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('username').value;
    userSchool = document.getElementById('password').value;

    currentUser.update({
        name: userName,
        school: userPassword,
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('info').disabled = true;
}