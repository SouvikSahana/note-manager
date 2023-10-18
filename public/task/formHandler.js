document.addEventListener('DOMContentLoaded', function() {
    const token= localStorage.getItem("token")
    if(token===null){
        window.location.assign("./signup")
    }
    const form = document.getElementById('myForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = form.elements.title.value;
        const description=form.elements.description.value

        addTask(title,description)
    });
});

async function addTask(title,description){
    const data={title,description}
    const options={
        method:'post',
        headers:{
            'Content-Type':'application/json',
            'Authorization': localStorage.getItem("token")
        },
        body:JSON.stringify(data)
    }
    const response=await fetch('/addnote',options)
    const responseData=await  response.json()
    if(responseData.message){
        alert(responseData.message)
    }else{
        console.log(responseData)
    }
    
}