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

function deleteAllTasks() {
    // Show confirmation dialog
    if (confirm("Are you sure you want to delete ALL tasks? This action cannot be undone.")) {
        // First, get all tasks from the server
        $.ajax({
            type: "get",
            url: "http://fsdiapi.azurewebsites.net/api/tasks",
            success: function (response) {
                let data = JSON.parse(response);
                let deletePromises = [];
                
                // Find all tasks with your name and delete them
                for (let i = 0; i < data.length; i++) {
                    let task = data[i];
                    if(task.name == "Ryan58"){
                        // Create a delete request for each task
                        let deletePromise = $.ajax({
                            type: "delete",
                            url: "http://fsdiapi.azurewebsites.net/api/tasks/" + task._id,
                            success: function(response) {
                                console.log("Task deleted:", task._id);
                            },
                            error: function(error) {
                                console.log("Error deleting task:", task._id, error);
                            }
                        });
                        deletePromises.push(deletePromise);
                    }
                }
                
                // Wait for all delete operations to complete
                Promise.all(deletePromises).then(function() {
                    console.log("All tasks deleted from server");
                    // Clear the display after server deletion
                    $(".get-list").empty();
                }).catch(function(error) {
                    console.log("Some tasks failed to delete:", error);
                    // Still clear display even if some deletions failed
                    $(".get-list").empty();
                });
            },
            error: function(error) {
                console.log("Error fetching tasks for deletion:", error);
                alert("Error connecting to server. Could not delete tasks.");
            }
        });
    }
}

function init() {
    console.log("App initialized");
    //load data
    loadTasks(); // Added this line to load existing tasks

    //hook events
    $("#btnSave").click(saveTask);
    $("#btnDeleteAll").click(deleteAllTasks);
}

window.onload = init;