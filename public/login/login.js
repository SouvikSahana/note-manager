document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');

    form.addEventListener('submit', function(event) {
        // Prevent the form from submitting with its default behavior (e.g., GET request)
        event.preventDefault();

        // Custom logic to handle form submission
        const email = form.elements.email.value;
        const password=form.elements.password.value

        // Example: Display form data in the console
        login(email,password)

        // Add user details to database
    });
});

async function login(email,password){
    const data={email,password}
    const options={
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }
    const response=await fetch('/login',options)
    const responseData=await  response.json()

    if(responseData.message){
        alert(responseData.message)
    }else{
        localStorage.setItem("token",responseData)
        console.log(responseData)
        window.location.assign("../")
    }
    
}