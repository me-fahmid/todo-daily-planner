// ==================== LIVE WATCH ====================
function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toDateString();
    document.getElementById("liveTime").textContent = time;
    document.getElementById("liveDate").textContent = date;
}
setInterval(updateTime, 1000);
updateTime();

// ==================== CALENDAR ====================
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();

    const calendarDays = document.getElementById("calendarDays");
    calendarDays.innerHTML = "";

    document.getElementById("currentMonth").textContent = months[currentMonth] + " " + currentYear;

    // Previous month tail
    for(let x = firstDay; x > 0; x--){
        const day = document.createElement("div");
        day.classList.add("calendar-day", "other-month");
        day.textContent = prevLastDate - x + 1;
        calendarDays.appendChild(day);
    }

    // Current month days
    for(let d=1; d<=lastDate; d++){
        const day = document.createElement("div");
        day.classList.add("calendar-day");
        if(d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()){
            day.classList.add("today");
        }
        day.textContent = d;
        calendarDays.appendChild(day);
    }

    // Next month head
    const totalDays = firstDay + lastDate;
    const nextDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    for(let n=1; n<=nextDays; n++){
        const day = document.createElement("div");
        day.classList.add("calendar-day", "other-month");
        day.textContent = n;
        calendarDays.appendChild(day);
    }
}
function changeMonth(offset) {
    currentMonth += offset;
    if(currentMonth > 11){
        currentMonth = 0;
        currentYear++;
    }
    if(currentMonth < 0){
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}
renderCalendar();

// ==================== TO-DO LIST ====================
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function updateTodoStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    document.getElementById("todoStats").textContent = `Total: ${total} | Completed: ${completed}`;
}

function renderTodos() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    if(todos.length === 0){
        list.innerHTML = `<div class="empty-state">No tasks yet. Add your first task!</div>`;
    } else {
        todos.forEach((todo, index) => {
            const li = document.createElement("li");
            li.classList.add("todo-item");
            li.innerHTML = `
                <div class="todo-checkbox ${todo.completed ? "checked" : ""}" onclick="toggleTodo(${index})"></div>
                <span class="todo-text ${todo.completed ? "completed" : ""}">${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${index})">×</button>
            `;
            list.appendChild(li);
        });
    }
    updateTodoStats();
}

function toggleInput() {
    document.getElementById("inputSection").classList.toggle("active");
}

function addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();
    if(text === "") return;
    todos.push({text: text, completed: false});
    input.value = "";
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

function toggleTodo(index){
    todos[index].completed = !todos[index].completed;
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

function deleteTodo(index){
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

renderTodos();

// ==================== NOTES ====================
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function renderNotes() {
    const list = document.getElementById("notesList");
    list.innerHTML = "";
    if(notes.length === 0){
        list.innerHTML = `<div class="empty-state">No notes yet. Add one!</div>`;
    } else {
        notes.forEach((note, index) => {
            const li = document.createElement("li");
            li.classList.add("note-item");
            li.innerHTML = `
                <span>${note}</span>
                <button class="delete-btn" onclick="deleteNote(${index})">×</button>
            `;
            list.appendChild(li);
        });
    }
}

function toggleNotesInput(){
    document.getElementById("notesInputSection").classList.toggle("active");
}

function addNote(){
    const input = document.getElementById("notesInput");
    const text = input.value.trim();
    if(text === "") return;
    notes.push(text);
    input.value = "";
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
}

function deleteNote(index){
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
}

renderNotes();

// ==================== FOCUS & REMEMBER ====================
function toggleEditMode(section) {
    const display = document.getElementById(`${section}Display`);
    const edit = document.getElementById(`${section}Edit`);
    if(edit.style.display === "block"){
        edit.style.display = "none";
        display.style.display = "block";
    } else {
        edit.style.display = "block";
        display.style.display = "none";
    }
}

function saveFocus() {
    const text = document.getElementById("focusText").value.trim();
    const list = document.getElementById("focusList");
    list.innerHTML = text.split("\n").map(t => `<li>${t}</li>`).join("");
    localStorage.setItem("focusList", JSON.stringify(text.split("\n")));
    toggleEditMode("focus");
}

function saveRemember() {
    const text = document.getElementById("rememberText").value.trim();
    const list = document.getElementById("rememberList");
    list.innerHTML = text.split("\n").map(t => `<li>${t}</li>`).join("");
    localStorage.setItem("rememberList", JSON.stringify(text.split("\n")));
    toggleEditMode("remember");
}

// Load saved focus & remember
const savedFocus = JSON.parse(localStorage.getItem("focusList"));
if(savedFocus){
    document.getElementById("focusList").innerHTML = savedFocus.map(t => `<li>${t}</li>`).join("");
    document.getElementById("focusText").value = savedFocus.join("\n");
}
const savedRemember = JSON.parse(localStorage.getItem("rememberList"));
if(savedRemember){
    document.getElementById("rememberList").innerHTML = savedRemember.map(t => `<li>${t}</li>`).join("");
    document.getElementById("rememberText").value = savedRemember.join("\n");
}

// DARK MODE TOGGLE
const darkModeBtn = document.getElementById("darkModeToggle");
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")){
        darkModeBtn.textContent = "☀️";
    } else {
        darkModeBtn.textContent = "🌙";
    }
});

