<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let tasks = [];
    let newTask = '';
    let newDeadlineDateTime = '';
    let newLocation = '';
    let newReminderDateTime = '';
    let newPriority = 'Low';
    let newCategory = 'Personal';
    let filter = 'all';

    onMount(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        setInterval(checkReminders, 60000); // Check reminders every minute
        loadTasks(); // Load tasks from local storage
    });

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    }

    function addTask() {
        if (newTask.trim() && newDeadlineDateTime && newReminderDateTime) {
            tasks = [
                ...tasks,
                {
                    text: newTask,
                    completed: false,
                    deadline: new Date(newDeadlineDateTime),
                    location: newLocation,
                    reminderTime: new Date(newReminderDateTime),
                    priority: newPriority,
                    category: newCategory,
                    showDetails: false
                }
            ];
            newTask = '';
            newDeadlineDateTime = '';
            newLocation = '';
            newReminderDateTime = '';
            saveTasks();
        }
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        tasks = [...tasks];
        saveTasks();
    }

    function toggleCompletion(index) {
        tasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function checkReminders() {
        const now = new Date();
        tasks.forEach((task, index) => {
            if (task.reminderTime && !task.completed && task.reminderTime <= now) {
                sendNotification(`${task.text} is due for reminder at ${task.reminderTime.toLocaleString()}`, task.location);
            }
            if (task.deadline && !task.completed && task.deadline <= now) {
                sendNotification(`${task.text} is due`, task.location);
                toggleCompletion(index);
            }
        });
    }

    function sendNotification(taskText, location) {
        if (Notification.permission === 'granted') {
            const notificationText = `${taskText}${location ? ` at ${location}` : ''}`;
            new Notification("Task Reminder", { body: notificationText });
        }
    }

    // Filtering by category and priority level
    $: filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    }).filter(task => {
        if ($page.url.pathname === '/work') return task.category === 'Work';
        if ($page.url.pathname === '/personal') return task.category === 'Personal';
        return true;
    });
</script>

<main>
    <h1 class="app-title">To-Do</h1>

    <!-- Task Input Section -->
    <div class="input-group">
        <b class="app-task">Task Input</b>
        <input class="task-input" bind:value={newTask} placeholder="Enter task" />
        <b class="app-reminder_date">Reminder Date</b>
        <input class="task-reminder" type="datetime-local" bind:value={newReminderDateTime} placeholder="Reminder Date-Time" />
        <b class="app-deadline_date">Deadline Date</b>
        <input class="task-deadline" type="datetime-local" bind:value={newDeadlineDateTime} placeholder="Deadline Date-Time" />
        <b class="app-task_location">Location</b>
        <input class="task-location" bind:value={newLocation} placeholder="Enter location" />
        <b class="app-priority">Priority of Work</b>
        <!-- Priority Selector -->
        <select class="task-priority" bind:value={newPriority}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>
        <b class="app-Category">Category of Task</b>
        <!-- Category Selector -->
        <select class="task-category" bind:value={newCategory}>
            <option>Personal</option>
            <option>Work</option>
        </select>

        <button class="add-button" on:click={addTask}>Add Task</button>
    </div>

    <!-- Filters -->
    <div class="filters">
        <button on:click={() => filter = 'all'} class:active={filter === 'all'}>All</button>
        <button on:click={() => filter = 'completed'} class:active={filter === 'completed'}>Completed</button>
        <button on:click={() => filter = 'incomplete'} class:active={filter === 'incomplete'}>Incomplete</button>
    </div>

    <!-- Task List -->
    <ul class="task-list">
        {#each filteredTasks as task, index}
            <li class="task-item {task.completed ? 'completed' : ''}">
                <div class="task-header" on:click={() => task.showDetails = !task.showDetails}>
                    <span>{task.text} - {task.priority} Priority - {task.category}</span>
                    <button class="complete-button" on:click={() => toggleCompletion(index)}>{task.completed ? 'Undo' : 'Complete'}</button>
                </div>

                {#if task.showDetails}
                    <div class="task-details">
                        <span>Deadline: {task.deadline.toLocaleString()}</span>
                        <span>Location: {task.location}</span>
                        <span>Reminder: {task.reminderTime.toLocaleString()}</span>
                        <button class="remove-button" on:click={() => removeTask(index)}>Delete</button>
                    </div>
                {/if}
            </li>
        {/each}
    </ul>
</main>

<style>
    /* Your existing styles go here */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Montserrat', sans-serif;
        background: linear-gradient(135deg, #ffafbd, #ffc3a0);
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    main {
        padding: 20px;
        border-radius: 20px;
        background: white;
        margin: 20px auto;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        overflow: auto;
    }

    .app-title {
        text-align: left;
        font-weight: 600;
        font-size: 2em;
        color: #333;
        padding-bottom: 10px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
    }

    .task-input, .task-deadline, .task-location, .task-reminder {
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 10px;
        font-size: 1em;
        outline: none;
        transition: border 0.3s;
    }

    .task-priority, .task-category {
        width: 100%;
        padding: 5px;
        border: 2px solid #ddd;
        border-radius: 10px;
        font-size: 1em;
        outline: none;
        transition: border 0.3s;
    }

    .task-input:focus, .task-deadline:focus, .task-location:focus, .task-reminder:focus {
        border-color: #007bff;
    }

    .add-button {
        padding: 12px;
        background: linear-gradient(90deg, #007bff, #00d4ff);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1em;
        font-weight: bold;
        transition: transform 0.2s;
    }

    .add-button:hover {
        transform: scale(1.05);
    }

    .filters {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 10px 0;
    }

    .filters button {
        padding: 8px 15px;
        background-color: #eee;
        color: #555;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.3s, color 0.3s;
    }

    .filters button.active, .filters button:hover {
        background-color: #007bff;
        color: white;
    }

    .task-list {
        list-style-type: none;
    }

    .task-item {
        background: #f7f8fa;
        margin-bottom: 15px;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }

    .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
    }

    .task-details {
        padding-top: 10px;
        color: #777;
    }

    .completed .task-header span {
        text-decoration: line-through;
        color: #999;
    }

    .complete-button, .remove-button {
        background: #4caf50;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s;
    }

    .remove-button {
        background: #f44336;
    }
</style>
