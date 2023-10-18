const name=document.getElementById("name")
const email=document.getElementById("email")
const token=localStorage.getItem("token")

async function getUserProfile(){
    if(token){
        const options={
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization": token
            }
        }
        const response=await fetch("/getprofile",options)
        const data=await response.json()
        if(data.message){
            alert(data.message)
        }else{
            name.textContent +=data.name
            email.textContent += data.email
        }
    }else{
        alert("Please Authenticate")
    }
}

async function logout(){
    if(token){
        const options={
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization": token
            }
        }
        const response=await fetch("/logout",options)
        const data=await response.json()
        if(data.message){
            alert(data.message)
        }else{
            console.log(data)
            localStorage.clear()
            window.location.assign("../login")
        }
    }else{
        alert("Something Went Wrong")
    }
}
getUserProfile()