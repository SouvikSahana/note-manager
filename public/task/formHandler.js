const taskContainer=document.getElementById("taskContainer")

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
    getTasks()  
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
        addTaskTemplate(responseData._id, responseData.title, responseData.description)
    }
    
}

async function getTasks(){
    const options={
        method:'post',
        headers:{
            'Content-Type':'application/json',
            'Authorization': localStorage.getItem("token")
        }
    }
    const response=await fetch('/gettasks',options)
    const responseData=await  response.json()
    if(responseData.message){
        alert(responseData.message)
    }else{
        responseData.forEach((arr)=>{
            addTaskTemplate(arr._id,arr.title, arr.description)
        })
    }
}

function addTaskTemplate(_id,title, description){
    const task=document.createElement("div")
    task.setAttribute('class','task')
    const _idElement= document.createElement("span")
    _idElement.setAttribute("class","_id")
    _idElement.textContent= ",   (id: "+_id+ ")"
    const titleElement= document.createElement("span")
    titleElement.textContent= title
    const descriptionElement= document.createElement("p")
    descriptionElement.textContent= description
    
    task.appendChild(titleElement)
    task.appendChild(_idElement)
    task.appendChild(descriptionElement)
    taskContainer.appendChild(task)
}
