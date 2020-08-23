//global variable for form to acces fields anywhere in code
import Task from "./task";
import { TaskManager } from "./task-manager";
import { editedTask } from "./task-manager";
import { s } from "./task-manager";

const taskForm = document.querySelector('[name="taskForm"]');
const formFooter = document.querySelector('[name="formFooter"]');
const formTitle = document.querySelector('[name="formTitle"]');
const submitBtn = document.getElementById("submit");
const taskcontainer = document.querySelector("#task");
const upcomingCards = document.querySelector(".upcomingSection");
let taskMgr;
let task;
let fieldsForm;
//let editedTask;
//let s = null;
document.getElementById("addTaskBtn").addEventListener("click", resetTaskForm);
function resetTaskForm() {
  formTitle.innerText = "New Task ";
  submitBtn.innerText = "Submit ";
}

class TaskForm {
  constructor() {}
  // this code checks all the form buttons and attach the functions that each one must perform//
  buttonDefault() {
    const allFormBtns = document.querySelectorAll(".formbtn");
    allFormBtns.forEach((btn) => {
      btn.name !== "submitBtn"
        ? btn.addEventListener("click", function () {
            taskMgr.resetValidation();
          })
        : btn.addEventListener("click", function () {
            fieldsForm.submitButtonClicked();
          });
    });
  }
  submitButtonClicked() {
    document.getElementById("tasksFilter").value = "All Tasks";
    console.log(editedTask);
    if (taskForm.dataset.edited === "true") {
      console.warn("inside edit task section");
      taskForm.dataset.edited = false;
      taskMgr.tasksList[s].name = taskForm.taskSubject.value;
      taskMgr.tasksList[s].description = taskForm.taskDescription.value;
      taskMgr.tasksList[s].assignee = taskForm.taskAssignee.value;
      taskMgr.tasksList[s].status = taskForm.taskStatus.value;
      taskMgr.tasksList[s].date = taskForm.taskDate.value;
      taskMgr.tasksList[s].time = taskForm.taskTime.value;
      taskMgr.refreshPage(taskMgr.tasksList);
    } else {
      taskMgr.addTask(
        taskForm.taskSubject.value,
        taskForm.taskDescription.value,
        taskForm.taskAssignee.value,
        taskForm.taskStatus.value,
        taskForm.taskDate.value,
        taskForm.taskTime.value
      );
    }
  }

  checkValidation(input) {
    if (
      input.name === "taskSubject" ||
      input.name === "taskDescription" ||
      input.name === "taskAssignee"
    ) {
      if (
        input.value.length < this.minLength ||
        input.value.length === "undefined"
      ) {
        this.setErrorFor(input, `${input.name} cannot be blank`);
        submitBtn.disabled = true;
      } else if (input.value.length > this.maxLength) {
        this.setErrorFor(input, `${input.name} is longer than 20 char!`);
        submitBtn.disabled = true;
      } else {
        this.setSuccessFor(input);
        submitBtn.disabled = false;
      }
    } else {
      const taskDateValue = date.value;
      var todayDate = new Date().toISOString().slice(0, 10);
      if (taskDateValue == null || taskDateValue == "") {
        this.setErrorFor(date, "Task must have a due date");
        submitBtn.disabled = true;
      } else if (taskDateValue < todayDate) {
        this.setErrorFor(date, "Task cannot be created in past date");
        submitBtn.disabled = true;
      } else {
        this.setSuccessFor(date);
        submitBtn.disabled = false;
      }
    }
  }

  setErrorFor(input, message) {
    const formgroup = input.parentElement;
    const small = formgroup.querySelector(".msg");
    small.innerText = message;
    small.style.color = "red";
    formgroup.className = "form-group error";
    submitBtn.disabled = true;
  }

  setSuccessFor(input) {
    const formgroup = input.parentElement;
    const small = formgroup.querySelector(".msg");
    small.innerText = "Looks good!";
    small.style.color = "green";
    formgroup.className = "form-group success";
    submitBtn.disabled = false;
  }
}

window.addEventListener("load", function () {
  taskMgr = new TaskManager(taskcontainer);
  task = new Task();
  fieldsForm = new TaskForm();
  taskForm.addEventListener("input", function (event) {
    fieldsForm.checkValidation(event.target);
  });
  taskMgr.loadFromLocalStorage();
  taskMgr.displayTasksByCategory();
  fieldsForm.buttonDefault();
});
