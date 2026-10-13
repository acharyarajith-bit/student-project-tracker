
const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');

// Projects exist only while the page is open.
const projects = [];

function renderProjects() {
    // Remove previously displayed projects.
    projectList.replaceChildren();

    // Display every project currently in the array.
    projects.forEach(project => {
        const projectItem = document.createElement('div');

        const projectName = document.createElement('h3');
        projectName.textContent = project.name;

        const projectStatus = document.createElement('p');
        projectStatus.textContent = `Status: ${project.status}`;

        projectItem.append(projectName, projectStatus);
        projectList.appendChild(projectItem);
    });

    // Update the empty state if your HTML contains it.
    if (emptyState) {
        emptyState.hidden = projects.length > 0;
    }
}

// Keep exactly one submit listener.
form.addEventListener('submit', event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const status = statusInput.value;

    // Do not add a project without a name.
    if (!name) {
        nameInput.focus();
        return;
    }

    // Create a project using the submitted form values.
    const project = {
        id: crypto.randomUUID(),
        name: name,
        status: status
    };

    projects.push(project);

    // Refresh the displayed list.
    renderProjects();

    // Clear the name field for the next project.
    nameInput.value = '';
    nameInput.focus();
});

// Show the initial empty state.
renderProjects();
