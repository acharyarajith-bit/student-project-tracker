const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const formTitle = document.querySelector('#form-title');
const message = document.querySelector('#message');

let projects = [];
let editingId = null;
let busy = false;

function showMessage(text) {
    message.textContent = text;
}

function setBusy(value) {
    busy = value;
    saveButton.disabled = value;
    cancelButton.disabled = value;

    projectList.querySelectorAll('button').forEach(button => {
        button.disabled = value;
    });
}

function resetForm() {
    form.reset();
    editingId = null;

    saveButton.textContent = 'Add Project';
    cancelButton.hidden = true;
    formTitle.textContent = 'Add a Project';
}

async function apiRequest(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch {
        throw new Error(
            'Could not connect to the server. Check that your server is running.'
        );
    }

    if (!response.ok) {
        let errorMessage = `Request failed (${response.status}).`;

        try {
            const data = await response.json();
            if (data.error) {
                errorMessage = data.error;
            }
        } catch {
            // Keep the default HTTP error message.
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

async function loadProjects() {
    showMessage('Loading projects...');

    try {
        const data = await apiRequest('/api/projects');

        if (!Array.isArray(data)) {
            throw new Error('The server returned an invalid project list.');
        }

        projects = data;
        renderProjects();
        showMessage(
            projects.length
                ? `Loaded ${projects.length} project(s).`
                : 'No projects added yet.'
        );

        return true;
    } catch (error) {
        showMessage(`Error loading projects: ${error.message}`);
        return false;
    }
}

function renderProjects() {
    projectList.replaceChildren();

    for (const project of projects) {
        const item = document.createElement('li');

        const heading = document.createElement('h3');
        heading.textContent = project.name;

        const status = document.createElement('p');
        status.textContent = `Status: ${project.status}`;

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', () => {
            if (busy) return;

            editingId = project.id;
            nameInput.value = project.name;
            statusInput.value = project.status;

            saveButton.textContent = 'Save changes';
            cancelButton.hidden = false;
            formTitle.textContent = 'Edit Project';

            nameInput.focus();
            showMessage(`Editing "${project.name}".`);
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', async () => {
            if (busy) return;

            const confirmed = window.confirm(
                `Are you sure you want to delete "${project.name}"?`
            );

            if (!confirmed) return;

            await deleteProject(project);
        });

        item.append(heading, status, editButton, deleteButton);
        projectList.appendChild(item);
    }

    emptyState.hidden = projects.length > 0;
}

async function deleteProject(project) {
    setBusy(true);
    showMessage(`Deleting "${project.name}"...`);

    try {
        await apiRequest(
            `/api/projects/${encodeURIComponent(project.id)}`,
            { method: 'DELETE' }
        );

        if (String(editingId) === String(project.id)) {
            resetForm();
        }

        const loaded = await loadProjects();

        if (loaded) {
            showMessage(`"${project.name}" deleted successfully.`);
        }
    } catch (error) {
        showMessage(`Could not delete project: ${error.message}`);
    } finally {
        setBusy(false);
        renderProjects();
    }
}

// One submit listener handles both creating and editing.
form.addEventListener('submit', async event => {
    event.preventDefault();

    if (busy) return;

    const name = nameInput.value.trim();
    const status = statusInput.value;

    if (!name) {
        showMessage('Please enter a project name.');
        nameInput.focus();
        return;
    }

    if (name.length > 80) {
        showMessage('Project name must be 80 characters or fewer.');
        nameInput.focus();
        return;
    }

    if (!['Planned', 'In Progress', 'Completed'].includes(status)) {
        showMessage('Please select a valid project status.');
        return;
    }

    const wasEditing = editingId !== null;
    const currentId = editingId;

    // Prevent duplicate submissions while a request is in progress.
    setBusy(true);
    showMessage(wasEditing ? 'Saving changes...' : 'Adding project...');

    try {
        const url = wasEditing
            ? `/api/projects/${encodeURIComponent(currentId)}`
            : '/api/projects';

        await apiRequest(url, {
            method: wasEditing ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, status })
        });

        // Only reset the form after the server accepts the mutation.
        resetForm();

        const loaded = await loadProjects();

        if (loaded) {
            showMessage(
                wasEditing
                    ? 'Project updated successfully.'
                    : 'Project added successfully.'
            );
        }
    } catch (error) {
        // Keep the entered values so the user can retry.
        showMessage(`Could not save project: ${error.message}`);
    } finally {
        setBusy(false);
        renderProjects();
    }
});

// Cancel an edit without sending an API request.
cancelButton.addEventListener('click', () => {
    if (busy) return;

    resetForm();
    showMessage('Edit cancelled.');
});

setBusy(true);
loadProjects().finally(() => {
    setBusy(false);
    renderProjects();
});

