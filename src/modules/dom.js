import { projectManager } from "./project.js";
import { createTask } from "./task.js";

const ui = (() => {
  const priorities = [
    { id: "priority-0", label: "-", color: "#aa8238", checked: true },
    { id: "priority-1", label: "1 - critical", color: "#ff0000" },
    { id: "priority-2", label: "2 - high", color: "#2f00ff" },
    { id: "priority-3", label: "3 - medium", color: "#fffb00" },
    { id: "priority-4", label: "4 - low", color: "#00ff00" },
  ];

  const init = () => {
    renderDefaultHomePage();
  };

  const renderDefaultHomePage = () => {
    projectManager.ensureAProjectExists();
    projectManager.addsTasksToDefaultProject();

    createInitialElements();
  };

  const createInitialElements = () => {
    const body = document.getElementById("app");

    // Sidebar
    const sidebar = createElementWithId("div", "sidebar");
    body.appendChild(sidebar);
    renderSidebar();

    // Main content
    const main = createElementWithId("div", "main-content");
    body.appendChild(main);
    const firstProject = projectManager.getProjects()[0]; // Get the first or default project
    renderProjectAsMainContent(firstProject.id);

    // Modal dialogs
    createAndAppendDialog(body, "add-project", populateAddProjectDialog);
    createAndAppendDialog(body, "edit-project");
    createAndAppendDialog(body, "add-task", populateAddTaskDialog);
    createAndAppendDialog(body, "edit-task");
  };

  const renderSidebar = () => {
    const sidebar = document.getElementById("sidebar");

    const sidebarHeader = createElementWithId("div", "icon-headings");
    sidebar.appendChild(sidebarHeader);

    const sidebarHeaderImage = document.createElement("img");
    sidebarHeaderImage.src = "../src/assets/Saitama-PNG-File.png";
    sidebarHeaderImage.alt = "";
    sidebarHeader.appendChild(sidebarHeaderImage);

    const sidebarHeaderHeadings = createElementWithId("div", "headings");
    const sidebarMajorHeading = document.createElement("h1");
    sidebarMajorHeading.textContent = "To Do List";
    sidebarHeaderHeadings.appendChild(sidebarMajorHeading);
    const sidebarMinorHeading = document.createElement("h3");
    sidebarMinorHeading.textContent = "Become a hero for fun!";
    sidebarHeaderHeadings.appendChild(sidebarMinorHeading);
    sidebarHeader.appendChild(sidebarHeaderHeadings);

    const viewAllTasksButton = createElementWithId(
      "button",
      "view-all-tasks-btn"
    );
    viewAllTasksButton.textContent = "View All Tasks";
    sidebar.appendChild(viewAllTasksButton);

    const createTaskButton = createElementWithId("button", "create-task-btn");
    createTaskButton.textContent = "+ Create Task";
    sidebar.appendChild(createTaskButton);

    const createProjectButton = createElementWithId(
      "button",
      "create-project-btn"
    );
    createProjectButton.textContent = "+ Create Project";
    sidebar.appendChild(createProjectButton);

    const sidebarProjectButtons = createElementWithId("div", "project-buttons");
    sidebar.appendChild(sidebarProjectButtons);

    viewAllTasksButton.addEventListener("click", (event) => {
      event.preventDefault();
      resetMainContent();
      const projects = projectManager.getProjects();
      projects.forEach((project) => {
        renderProjectAsMainContent(project.id);
      });
    });

    createTaskButton.addEventListener("click", (event) => {
      event.preventDefault();
      showCreateTaskDialog();
    });

    createProjectButton.addEventListener("click", (event) => {
      event.preventDefault();
      showCreateProjectDialog();
    });

    renderSidebarProjectButtons();
  };

  const renderSidebarProjectButtons = () => {
    const projectButtons = document.getElementById("project-buttons");

    const projectButtonsHeading = document.createElement("h2");
    projectButtonsHeading.textContent = "Projects";
    projectButtons.appendChild(projectButtonsHeading);

    const projects = projectManager.getProjects();
    projects.forEach((project) => {
      const projectButton = createElementWithId("button", "project-btn");

      const projectTitle = document.createElement("div");
      projectTitle.textContent = project.title;
      projectButton.appendChild(projectTitle);

      const subButtons = createElementWithId("div", "sub-button");

      const editSubButton = document.createElement("span");
      editSubButton.textContent = "Edit";
      subButtons.appendChild(editSubButton);
      const deleteSubButton = document.createElement("span");
      deleteSubButton.textContent = "Delete";
      subButtons.appendChild(deleteSubButton);

      projectButton.appendChild(subButtons);
      projectButtons.appendChild(projectButton);

      //Event listeners
      projectButton.addEventListener("click", (event) => {
        event.preventDefault();
        resetMainContent();
        renderProjectAsMainContent(project.id);
      });

      editSubButton.addEventListener("click", (event) => {
        event.preventDefault();
        populateEditProjectDialog(project.id);
        showEditProjectDialog();
      });

      deleteSubButton.addEventListener("click", (event) => {
        event.preventDefault();

        showDeleteConfirmation(
          "Do you really want to delete this project and all its tasks?",
          () => {
            console.log("Deletion confirmed");
            projectManager.deleteProject(project.id, project.title);
            console.log("Project has been deleted!");
            location.reload();
          },
          () => console.log("Deletion canceled")
        );
      });
    });
  };

  const renderProjectAsMainContent = (projectId) => {
    const mainContent = document.getElementById("main-content");

    const project = projectManager.getProject(projectId);

    if (!project) {
      mainContent.innerHTML = "Error: Project not found!";
      return;
    }

    const h1 = document.createElement("h1");
    h1.textContent = project.title;
    mainContent.appendChild(h1);

    const projectDescription = document.createElement("p");
    projectDescription.textContent = project.description;
    mainContent.appendChild(projectDescription);

    const cards = createElementWithId("div", "cards");
    mainContent.appendChild(cards);

    if (project.tasks.length === 0) {
      cards.appendChild(document.createElement("br"));
      const noTasks = document.createElement("p");
      noTasks.textContent = "No tasks in this project yet!";
      cards.appendChild(noTasks);
    }

    project.tasks.forEach((task) => {
      const taskCard = createElementWithId("div", "card task");
      taskCard.innerHTML = `<div id="card-title">${task.title}</div>
            <div id="due-date">Due Date: ${task.dueDate}</div>
            <div id="card-btns">
              <button id="edit-task-btn">Edit</button>
              <button id="delete-task-btn">Delete</button>
            </div>`;
      cards.appendChild(taskCard);

      // Event Listeners
      taskCard.addEventListener("click", (event) => {
        event.preventDefault();
        renderTaskAsMainContent(project.id, task.id);
      });

      taskCard
        .querySelector("#edit-task-btn")
        .addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          populateEditTaskDialog(task, projectId);
          showEditTaskDialog();
        });

      taskCard
        .querySelector("#delete-task-btn")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          showDeleteConfirmation(
            "Do you really want to delete this task?",
            () => {
              console.log("Deletion confirmed");
              projectManager.deleteTaskFromProject(project.id, task.id);
              location.reload();
            },
            () => console.log("Deletion canceled")
          );
        });
    });
  };

  const renderTaskAsMainContent = (projectId, taskId) => {
    resetMainContent();
    const mainContent = document.getElementById("main-content");

    const projectTitle = projectManager.getProject(projectId).title;
    const task = projectManager.getTaskFromProject(projectId, taskId);

    const taskMainContent = createElementWithId("div", "task-main-content");
    taskMainContent.innerHTML = `<h2 id="task-title">${task.title}</h2>
    <p id="task-due-date">Due Date: ${task.dueDate}</p>
    <p id="task-status">Completed: ${task.completed}</p>
    <p id="task-project">Project: ${projectTitle}</p>
    <p id="task-priority">Priority: ${displayPriority(task.priority)}</p>
    <p id="task-description">Description: ${task.description}</p>
    <div id="btns">
      <button id="edit-task-btn">Edit</button>
      <button id="delete-task-btn">Delete</button>
    </div>`;
    mainContent.appendChild(taskMainContent);

    // Event listeners
    const editTaskButton = document.getElementById("edit-task-btn");
    editTaskButton.addEventListener("click", (event) => {
      event.preventDefault();
      populateEditTaskDialog(task, projectId);
      showEditTaskDialog();
    });

    const deleteTaskButton = document.getElementById("delete-task-btn");
    deleteTaskButton.addEventListener("click", (event) => {
      event.preventDefault();
      showDeleteConfirmation(
        "Do you really want to delete this task?",
        () => {
          console.log("Deletion confirmed");
          projectManager.deleteTaskFromProject(projectId, taskId);
          location.reload();
        },
        () => console.log("Deletion canceled")
      );
    });
  };

  // Helpers to populate dialogs
  const populateAddProjectDialog = () => {
    const dialog = document.getElementById("add-project");

    const heading = document.createElement("h1");
    heading.textContent = "Add Project";
    dialog.appendChild(heading);

    const form = document.createElement("form");
    form.title = "add-project";
    dialog.appendChild(form);

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.textContent = "Title: ";
    form.appendChild(titleLabel);

    const titleInput = createElementWithId("input", "title");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.required = true;
    form.appendChild(titleInput);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "description");
    descriptionLabel.textContent = "Description: ";
    form.appendChild(descriptionLabel);

    form.appendChild(document.createElement("br"));

    const descriptionInput = createElementWithId("textarea", "description");
    descriptionInput.name = "description";
    descriptionInput.rows = "5";
    descriptionInput.cols = "43";
    form.appendChild(descriptionInput);

    form.appendChild(document.createElement("br"));

    const buttons = createElementWithId("div", "dialog-btns");
    form.appendChild(buttons);

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Save";
    buttons.appendChild(submit);

    const close = createElementWithId("button", "close");
    close.textContent = "Close";
    buttons.appendChild(close);

    // Event Listeners
    submit.addEventListener("click", (event) => {
      event.preventDefault();

      projectManager.addProject(titleInput.value, descriptionInput.value);
      console.log("Project created successfully!");

      dialog.close();
      console.log(location);
      location.reload();
    });

    close.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.close();
    });
  };

  const populateEditProjectDialog = (projectId) => {
    const project = projectManager.getProject(projectId);
    const dialog = document.getElementById("edit-project");

    dialog.innerHTML = ""; // clear previous dialog content

    const heading = document.createElement("h1");
    heading.textContent = "Edit Project";
    dialog.appendChild(heading);

    const form = document.createElement("form");
    form.title = "edit-project";
    dialog.appendChild(form);

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.textContent = "Title: ";
    form.appendChild(titleLabel);

    const titleInput = createElementWithId("input", "title");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.required = true;
    titleInput.value = project.title;
    form.appendChild(titleInput);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "description");
    descriptionLabel.textContent = "Description: ";
    form.appendChild(descriptionLabel);

    form.appendChild(document.createElement("br"));

    const descriptionInput = createElementWithId("textarea", "description");
    descriptionInput.name = "description";
    descriptionInput.rows = "5";
    descriptionInput.cols = "43";
    descriptionInput.value = project.description;
    form.appendChild(descriptionInput);

    form.appendChild(document.createElement("br"));

    const buttons = createElementWithId("div", "dialog-btns");
    form.appendChild(buttons);

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Save";
    buttons.appendChild(submit);

    const close = createElementWithId("button", "close");
    close.textContent = "Close";
    buttons.appendChild(close);

    // Event Listeners
    submit.addEventListener("click", (event) => {
      event.preventDefault();

      projectManager.editProject(projectId, {
        title: titleInput.value,
        description: descriptionInput.value,
      });

      dialog.close();
      location.reload();
    });

    close.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.close();
    });
  };

  const populateAddTaskDialog = () => {
    const dialog = document.getElementById("add-task");

    const heading = document.createElement("h1");
    heading.textContent = "Add Task";
    dialog.appendChild(heading);

    const form = document.createElement("form");
    form.title = "add-task";
    dialog.appendChild(form);

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.textContent = "Title: ";
    form.appendChild(titleLabel);

    const titleInput = createElementWithId("input", "title");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.required = true;
    form.appendChild(titleInput);

    const projectLabel = document.createElement("label");
    projectLabel.setAttribute("for", "project");
    projectLabel.textContent = "Project: ";
    form.appendChild(projectLabel);

    form.appendChild(document.createElement("br"));

    const projectInput = createElementWithId("select", "project");
    projectInput.name = "project";
    projectInput.required = true;
    form.appendChild(projectInput);

    projectManager.getProjects().forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.title;
      projectInput.appendChild(option);
    });

    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "description");
    descriptionLabel.textContent = "Description: ";
    form.appendChild(descriptionLabel);

    form.appendChild(document.createElement("br"));

    const descriptionInput = createElementWithId("textarea", "description");
    descriptionInput.name = "description";
    descriptionInput.rows = "5";
    descriptionInput.cols = "43";
    form.appendChild(descriptionInput);

    form.appendChild(document.createElement("br"));

    const dueDateLabel = document.createElement("label");
    dueDateLabel.setAttribute("for", "due");
    dueDateLabel.textContent = "Due Date: ";
    form.appendChild(dueDateLabel);

    const dueDateInput = createElementWithId("input", "due");
    dueDateInput.type = "datetime-local";
    dueDateInput.name = "due-date";
    dueDateInput.value = new Date().toISOString().slice(0, 16);
    form.appendChild(dueDateInput);

    const fieldset = document.createElement("fieldset");
    form.appendChild(fieldset);

    const legend = document.createElement("legend");
    legend.setAttribute("for", "priority");
    legend.textContent = "Priority: ";
    fieldset.appendChild(legend);

    priorities.forEach((priority) => {
      const radio = createElementWithId("input", priority.id);
      radio.type = "radio";
      radio.name = "priority";

      if (priority.checked) radio.setAttribute("checked", "checked");
      if (priority.value) radio.setAttribute("value", priority.value);

      const label = document.createElement("label");
      label.setAttribute("for", priority.id);

      const span = document.createElement("span");
      span.classList.add("color-swatch");
      span.style.backgroundColor = priority.color;

      label.appendChild(span);
      label.appendChild(document.createTextNode(` ${priority.label}`));

      fieldset.appendChild(radio);
      fieldset.appendChild(label);

      fieldset.appendChild(document.createElement("br"));
    });

    form.appendChild(document.createElement("br"));

    const buttons = createElementWithId("div", "dialog-btns");
    form.appendChild(buttons);

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Save";
    buttons.appendChild(submit);

    const close = createElementWithId("button", "close");
    close.textContent = "Close";
    buttons.appendChild(close);

    // Event Listeners
    submit.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedPriority = Array.from(form.elements["priority"]).find(
        (radio) => radio.checked
      );

      const taskData = {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: selectedPriority ? selectedPriority.id : null,
      };

      const projectId = projectInput.value;

      projectManager.addTaskToProject(projectId, createTask(taskData));
      console.log("Task created successfully!");

      dialog.close();
      location.reload();
    });

    close.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.close();
    });
  };

  const populateEditTaskDialog = (task, currentProjectId) => {
    const dialog = document.getElementById("edit-task");

    dialog.innerHTML = ""; // clear previous dialog content

    const heading = document.createElement("h1");
    heading.textContent = "Edit Task";
    dialog.appendChild(heading);

    const form = document.createElement("form");
    form.title = "edit-task";
    dialog.appendChild(form);

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.textContent = "Title: ";
    form.appendChild(titleLabel);

    const titleInput = createElementWithId("input", "title");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.required = true;
    titleInput.value = task.title;
    form.appendChild(titleInput);

    const projectLabel = document.createElement("label");
    projectLabel.setAttribute("for", "project");
    projectLabel.textContent = "Project: ";
    form.appendChild(projectLabel);

    form.appendChild(document.createElement("br"));

    const projectInput = createElementWithId("select", "project");
    projectInput.name = "project";
    projectInput.required = true;

    projectManager.getProjects().forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.title;
      if (project.id === currentProjectId) {
        option.selected = true;
      }
      projectInput.appendChild(option);
    });

    form.appendChild(projectInput);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "description");
    descriptionLabel.textContent = "Description: ";
    form.appendChild(descriptionLabel);

    form.appendChild(document.createElement("br"));

    const descriptionInput = createElementWithId("textarea", "description");
    descriptionInput.name = "description";
    descriptionInput.rows = "5";
    descriptionInput.cols = "43";
    descriptionInput.value = task.description;
    form.appendChild(descriptionInput);

    form.appendChild(document.createElement("br"));

    const dueDateLabel = document.createElement("label");
    dueDateLabel.setAttribute("for", "due");
    dueDateLabel.textContent = "Due Date: ";
    form.appendChild(dueDateLabel);

    const dueDateInput = createElementWithId("input", "due");
    dueDateInput.type = "datetime-local";
    dueDateInput.name = "due-date";
    dueDateInput.value = new Date(task.dueDate).toISOString().slice(0, 16);
    form.appendChild(dueDateInput);

    form.appendChild(document.createElement("br"));

    const completedLabel = document.createElement("label");
    completedLabel.setAttribute("for", "completed");
    completedLabel.textContent = "Completed: ";
    form.appendChild(completedLabel);

    const completedCheckbox = createElementWithId("input", "completed");
    completedCheckbox.type = "checkbox";
    completedCheckbox.name = "completed";
    completedCheckbox.checked = task.completed;
    form.appendChild(completedCheckbox);

    form.appendChild(document.createElement("br"));

    const fieldset = document.createElement("fieldset");
    form.appendChild(fieldset);

    const legend = document.createElement("legend");
    legend.setAttribute("for", "priority");
    legend.textContent = "Priority: ";
    fieldset.appendChild(legend);

    priorities.forEach((priority) => {
      const radio = createElementWithId("input", priority.id);
      radio.type = "radio";
      radio.name = "priority";
      radio.value = priority.id;

      if (priority.id === task.priority) {
        radio.checked = true;
      }

      const label = document.createElement("label");
      label.setAttribute("for", priority.id);

      const span = document.createElement("span");
      span.classList.add("color-swatch");
      span.style.backgroundColor = priority.color;

      label.appendChild(span);
      label.appendChild(document.createTextNode(` ${priority.label}`));

      fieldset.appendChild(radio);
      fieldset.appendChild(label);

      fieldset.appendChild(document.createElement("br"));
    });

    form.appendChild(document.createElement("br"));

    const buttons = createElementWithId("div", "dialog-btns");
    form.appendChild(buttons);

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Save";
    buttons.appendChild(submit);

    const close = createElementWithId("button", "close");
    close.textContent = "Close";
    buttons.appendChild(close);

    // Event Listeners
    submit.addEventListener("click", (event) => {
      event.preventDefault();

      const updatedTask = {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: form.elements["priority"].value,
        completed: completedCheckbox.checked,
      };
      const projectId = projectInput.value;

      if (projectId !== currentProjectId) {
        projectManager.addTaskToProject(projectId, createTask(updatedTask));
        projectManager.deleteTaskFromProject(currentProjectId, task.id);
      }

      projectManager.editTaskInProject(projectId, task.id, updatedTask);

      dialog.close();
      location.reload();
    });

    close.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.close();
    });
  };

  /* Helpers to show the relevant dialogs */
  const showCreateTaskDialog = () => {
    const dialog = document.getElementById("add-task");
    dialog.showModal();
  };

  const showCreateProjectDialog = () => {
    const dialog = document.getElementById("add-project");
    dialog.showModal();
  };

  const showEditTaskDialog = () => {
    const dialog = document.getElementById("edit-task");
    dialog.showModal();
  };

  const showEditProjectDialog = () => {
    const dialog = document.getElementById("edit-project");
    dialog.showModal();
  };

  // Helper to create an element with an ID
  const createElementWithId = (tagName, id) => {
    const element = document.createElement(tagName);
    element.id = id;
    return element;
  };

  // Helper to create and append dialogs
  const createAndAppendDialog = (parent, id, populateFunction) => {
    const dialog = createElementWithId("dialog", id);
    parent.appendChild(dialog);
    if (populateFunction) populateFunction();
  };

  // Helper to reset main-content page area
  const resetMainContent = () => {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = ""; // clears current content so there is no duplication
  };

  // Helper for displaying priority
  const displayPriority = (priorityId) => {
    const priority = priorities.find((p) => p.id === priorityId);
    return priority ? priority.label : "Unknown Priority";
  };

  // Deletion confirmation function
  function showDeleteConfirmation(message, onConfirm, onCancel) {
    const userConfirmed = window.confirm(
      message || "Are you sure you want to delete this?"
    );
    if (userConfirmed) {
      if (onConfirm) onConfirm();
    } else {
      if (onCancel) onCancel();
    }
  }

  return { init };
})();

export default ui;
