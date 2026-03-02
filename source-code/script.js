//To get the elements we need from HTML
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const clearDoneBtn = document.getElementById("clearDone");

//Our main data(array of task objects)
let tasks = loadTasks();

//Renders tasks when the page Loads
renderTasks();

//When the form submits(Add Task is clicked)
taskForm.addEventListener("submit", (e)=>{
    e.preventDefault();//stops the page from refreshing

    const text = taskInput.value.trim();
    if(text === "") return; //Don't add empty tasks

    const newTask = {
        id: crypto.randomUUID(), //Unique ID for each task
        text: text,
        completed: false,
    };
    tasks.unshift(newTask); 
    taskInput.value = ""; //clear input after task is added

    saveTasks();
    renderTasks();
});

//When filter changes(All, Active, Completed)
filter.addEventListener("change", ()=>{
    renderTasks();
});

//Clear Completed Tasks button
clearDoneBtn.addEventListener("click", ()=>{
    tasks = tasks.filter(task => task.completed === false);
    saveTasks();
    renderTasks();
});

//Handle clicks inside the task list (checkbox and delete button) using one listener
taskList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if(!li) return; //Click was outside of a task item

    const id = li.dataset.id;

    //If checkbox is clicked, togle is completed
    if(e.target.classList.contains("check")){
        tasks = tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
        );
        saveTasks();
        renderTasks();
    }
    if(e.target.classList.contains("delete")){
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
});

//---Helper Functions---
//Show tasks on the screen
function renderTasks(){
    taskList.innerHTML =  ""; //Clear current list

    const visibleTasks = getFilteredTasks();

    visibleTasks.forEach((task) => {
        const li  = document.createElement("li");
        li.dataset.id = task.id; //Store task ID in data attribute

        //add a class when completeted for styling
        if(task.completed){
            li.classList.add("completed");
        }
        li.innerHTML = `
            <div class = "left">
                <input type = "checkbox" class = "check" ${task.completed ? "checked" : ""}/>
                <span class = "text"></span>
            </div>
            <button class = "delete">x</button>
        `;
        li.querySelector(".text").textContent = task.text;
        taskList.appendChild(li);
    });
}
//Decide what tasks to display based on the dropdown filter
function getFilteredTasks(){
    if (filter.value === "active"){
        return tasks.filter(task => task.completed === false);
    }
    if (filter.value === "completed"){
        return tasks.filter(task => task.completed === true);
    }

    return tasks; //For "all", return everything
}
//Save tasks to localStorage
function saveTasks(){
    localStorage.setItem("tasks_v1", JSON.stringify(tasks));
}

//Load tasks from localStorage
function loadTasks(){
    try {
        return JSON.parse(localStorage.getItem("tasks_v1")) ?? [];
    } catch {
        return [];
    }
}
