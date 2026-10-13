let projects = [];

export function list() {
    return projects;
}

export function create(project) {
    projects.push(project);
    return project;
}

export function findById(id) {
    return projects.find(project => project.id === id);
}

export function update(id, changes) {
    const project = findById(id);

    if (!project) {
        return null;
    }

    Object.assign(project, changes);
    return project;
}

export function remove(id) {
    const index = projects.findIndex(project => project.id === id);

    if (index === -1) {
        return false;
    }

    projects.splice(index, 1);
    return true;
}