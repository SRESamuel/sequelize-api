async function select(id){
    const res = await fetch(`/api/users/${id}`);
    const user = await res.json();
    $("#firstName").val(user.firstName);
    $("#lastName").val(user.lastName);
    $("#id").val(user.id);
}

async function deleteContact(id){
    const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
    });
    console.log(res);
    updateContacts();

}

function getInitials(firstName, lastName) {
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}

async function createNew(){
    $("#firstName").val("");
    $("#lastName").val("");
    $("#id").val("");
}

function validateUserData(userData) {
    const errors = [];
    if (!userData.firstName || userData.firstName.trim() === '') {
        errors.push('First name is required.');
    }
    if (!userData.lastName || userData.lastName.trim() === '') {
        errors.push('Last name is required.');
    }
    return errors;
}

async function updateContacts() {
    const res = await fetch("/api/users");
    const users = await res.json();
    $("#theList").html("");
    for (const user of users) {
        const initials = getInitials(user.firstName, user.lastName);
        $("#theList").append(`
            <div class="user-entry">
                <div class="user-avatar">${initials}</div>
                <a href="#" onclick="select(${user.id})">${user.firstName} ${user.lastName}</a>
                <button onclick="deleteContact(${user.id})">x</button>
            </div>
        `);
    }
}

async function submitForm(event) {
    event.preventDefault();

    // Get form values
    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#email").val(); // Assuming you have an email field
    const phone = $("#phone").val(); // Assuming you have a phone field
    const id = $("#id").val(); // The ID of the user (empty for new users)

    // Determine the correct URL and method based on whether it's a new or existing user
    const url = id ? `/api/users/${id}` : '/api/users';
    const method = id ? 'PUT' : 'POST'; // 'PUT' for update, 'POST' for create

    // Make the fetch request to the server
    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, phone }) // Send user data
        });

        // Check if the response is not ok (e.g., validation error, server error)
        if (!res.ok) {
            const data = await res.json();
            if (data.errors) {
                // Display the errors to the user
                alert("Validation errors: " + data.errors.join(", "));
                return false;
            } else {
                // Handle other types of errors (e.g., server errors)
                alert("An error occurred. Please try again.");
                return false;
            }
        }

        // If the response is ok, handle the successful response here
        console.log("User saved successfully.");
        updateContacts(); // Update the contact list
    } catch (error) {
        // Handle network errors or issues with the fetch request
        console.error("There was an error submitting the form:", error);
        alert("An error occurred while submitting the form. Please try again.");
    }

    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    updateContacts();
});