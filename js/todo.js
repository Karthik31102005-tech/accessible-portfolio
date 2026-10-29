const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

let tasks = JSON.parse(localStorage.getItem("todo-tasks") || "[]");
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        const span = document.createElement("span");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Complete ${task.text}`);

        span.textContent = task.text;

        if (task.completed) {
            span.style.textDecoration = "line-through";
        }

        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.dataset.action = "edit";

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";

        li.dataset.id = task.id;
        li.append(checkbox, span, editButton, deleteButton);
        taskList.appendChild(li);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
    emptyMessage.hidden = filteredTasks.length > 0;
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: crypto.randomUUID(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskForm.reset();
    taskInput.focus();
});

taskList.addEventListener("change", event => {
    if (event.target.type !== "checkbox") return;

    const li = event.target.closest("li");
    const task = tasks.find(item => item.id === li.dataset.id);

    if (task) {
        task.completed = event.target.checked;
        saveTasks();
        renderTasks();
    }
});

taskList.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    const li = button.closest("li");
    const task = tasks.find(item => item.id === li.dataset.id);

    if (!task) return;

    if (button.dataset.action === "delete") {
        tasks = tasks.filter(item => item.id !== task.id);
    }

    if (button.dataset.action === "edit") {
        const updatedText = prompt("Edit task:", task.text);

        if (updatedText === null) return;
        if (!updatedText.trim()) {
            alert("Task cannot be empty.");
            return;
        }

        task.text = updatedText.trim().slice(0, 200);
    }

    saveTasks();
    renderTasks();
});

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();