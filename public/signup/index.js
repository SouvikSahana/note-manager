document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');

    form.addEventListener('submit', function(event) {
        // Prevent the form from submitting with its default behavior (e.g., GET request)
        event.preventDefault();

        // Custom logic to handle form submission
        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const password=form.elements.password.value

        // Example: Display form data in the console
        addUser(name,email,password)

        // Add user details to database
    });
});

async function addUser(name,email,password){
    const data={name,email,password}
    const options={
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }
    const response=await fetch('/signup',options)
    const responseData=await  response.json()
    
    if(responseData.message){
        alert(responseData.message)
    }else{
        localStorage.setItem("token",responseData)
        console.log(responseData)
        window.location.assign("../")
    }
    
}