function saveTask() {
    console.log("Save Button Clicked");
    //get the values from the form
    const title = $("#txtTitle").val();
    const description = $("#txtDescription").val();
    const color = $("#selColor").val();
    const date = $("#selDate").val();
    const status = $("#selStatus").val();
    const budget = $("#numBudget").val();
    console.log(title, description, color, date, status, budget);
    //build the task object
    let newTask = new Task(title, description, color, date, status, budget);
    console.log(newTask)
    //send the task object to the server
    $.ajax({
        type: "post",
        url: "http://fsdiapi.azurewebsites.net/api/tasks/",
        data : JSON.stringify(newTask),
        contentType: "application/json",
        success: function (response) {
            console.log("Task saved successfully", response);
        },
        error: function(error) {
            console.log("Error saving task", error);
        }  
    });

    //display the task in the list section
    displayTask(newTask);
}

function loadTasks() {
    // use the GET method to retrieve tasks from the server
    // the server name is http://fsdiapi.azurewebsites.net/api/tasks
    // let data = JSON.parse(response); <-- this is how you parse the response from the server
    // find where to put the tasks 
    $.ajax({
        type: "get",
        url: "http://fsdiapi.azurewebsites.net/api/tasks",
        success: function (response) {
            let data = JSON.parse(response);
            for (let i = 0; i < data.length; i++) {
                let x = data[i];
                if(x.name == "Ryan58"){
                    displayTask(x); // Fixed: changed 'task' to 'x'
                }
            }
        }
    })
}

function displayTask(task)
{
    let taskHTML = `<div class="task-item" style="background-color:${task.color}">
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p>Date: ${task.date}</p>
    <p>Status: ${task.status}</p>
    <p>Budget: ${task.budget}</p>
    </div>`; // Added closing div tag
    $(".get-list").append(taskHTML);
} 

function testConnection() {
    $.ajax({
        type: "get",
        url: "http://fsdiapi.azurewebsites.net",
        success: function (res) {
            console.log(res)
        },
        error: function (errorMsg) {
            console.log(errorMsg);
        }
    })
}

function init() {
    console.log("App initialized");
    //load data
    loadTasks(); // Added this line to load existing tasks

    //hook events
    $("#btnSave").click(saveTask);
}

window.onload = init;