d = document;

/* Elementos de view Tasks */

const $btnAddTask = d.getElementById("btnAddTask")
const $containerTasksPend = d.getElementById("tasksPendientes")
const $containerTasksFin = d.getElementById("tasksFinalizado")

/* Elementos para crear Tasks */

const $modalCreateTask = d.getElementById("modalCreateTask")
const modalCreate = new bootstrap.Modal($modalCreateTask);

const $txtTitulo = d.getElementById("txtCreateTitulo")
const $txtDescripcion = d.getElementById("txtCreateDescripcion")
const $btnCreate = d.getElementById("btnCreate")

/* Elementos para modificar Tasks */

const $modalUpdateTask = d.getElementById("modalUpdateTask")
const modalUpdate = new bootstrap.Modal($modalUpdateTask)

const $selectUpdateTask = d.getElementById("selectUpdateTask")
const $txtUpdateTitulo = d.getElementById("txtUpdateTitulo")
const $textUpdateDescripcion = d.getElementById("textUpdateDescripcion")
const $chkUpdateCompleted = d.getElementById("chkUpdateCompleted")
const $btnGuardarUpdate = d.getElementById("btnGuardarUpdate")


/* Elementos para eliminar Tasks */

const $modalDeleteTask = d.getElementById("modalDeleteTask")
const modalDelete = new bootstrap.Modal($modalDeleteTask)

const $selectDeleteTask = d.getElementById("selectDeleteTask")
const $btnDelete = d.getElementById("btnDelete")

// Array de tareas para renderizar, usada en get_tasks(), create_task(), update_task(), delete_task()
let arrayTasks = []

get_tasks()
    .then(() => {
        renderTasks(arrayTasks);

    })
    .catch(error => {
        new bs5.Toast({
            body: `Error al obtener información de tareas: ${error}`,
            className: 'border-0 bg-danger text-white',
        }).show();
    }
    );

// Eventos
$selectUpdateTask.addEventListener('change', function () {
    const task = arrayTasks.find(task => task.id == this.value);
    $txtUpdateTitulo.value = task.title;
    $textUpdateDescripcion.value = task.description;
    $chkUpdateCompleted.checked = task.completed ? true : false;
});


// Solicitud GET para tareas
async function get_tasks() {

    const token = sessionStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/get_tasks/", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                sessionStorage.removeItem("access_token");
                window.location.href = "/login";
                new bs5.Toast({
                    body: `No autorizado. Logueate nuevamente`,
                    className: 'border-0 bg-warning text-white',
                }).show();
                return;
            }
            throw new Error(`Error de conexión: ${response.status}`);
        }

        arrayTasks = await response.json();

    } catch (error) {
        new bs5.Toast({
            body: `Error de conexión: ${error}`,
            className: 'border-0 bg-warning text-white',
        }).show();
        return;
    }

}

// Renderizar las tareas existentes en view
function renderTasks(arrayTasks) {

    $containerTasksPend.innerHTML = '';
    $containerTasksFin.innerHTML = '';

    arrayTasks.forEach((task, index) => {
        const taskContainer = document.createElement('div');
        const collapseContainer = document.createElement('div');
        const button = document.createElement('a');
        const collapseDiv = document.createElement('div');
        const content = document.createElement('p');

        taskContainer.className = 'container mb-2';
        collapseContainer.className = 'text-start row';
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', `collapse-${index}`);
        button.href = `#collapse-${index}`;
        button.textContent = task.title;

        collapseDiv.className = 'collapse';
        collapseDiv.id = `collapse-${index}`;
        content.textContent = task.description;

        collapseDiv.appendChild(content);
        collapseContainer.appendChild(button);
        collapseContainer.appendChild(collapseDiv);
        taskContainer.appendChild(collapseContainer);

        if (task.completed) {
            button.className = 'btn btn-success btnCollapseFinalizado';
            $containerTasksFin.appendChild(taskContainer);
        }
        else {
            button.className = 'btn btn-secondary btnCollapsePendientes';
            $containerTasksPend.appendChild(taskContainer);
        }

        // Style collapseDiv
        collapseDiv.style.backgroundColor = '#f8f9fa';
        collapseDiv.style.padding = '10px';
        collapseDiv.style.border = '1px solid #ccc';
        collapseDiv.style.borderRadius = '5px';
        
        
        // Llenar select para update y delete
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.title;
        $selectUpdateTask.appendChild(option);
        $selectDeleteTask.appendChild(option.cloneNode(true));

    });

}

// Llenar select para update y delete
function renderTaskSelectOptions(){
    $selectUpdateTask.innerHTML = '';
    $selectDeleteTask.innerHTML = '';

    arrayTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.title;
        $selectUpdateTask.appendChild(option);
        $selectDeleteTask.appendChild(option.cloneNode(true));
    });
}

// #region Crear tareas

// Solicitud POST para crear tareas
async function create_task(title, description) {
    const token = sessionStorage.getItem("access_token");

    try {

        const response = await fetch('http://127.0.0.1:8000/api/tasks/create_task', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false,
                id_user: sessionStorage.getItem('id_user')
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al crear la tarea');
        }

        const newTask = await response.json();
        arrayTasks.push(newTask);
        modalCreate.hide();

    } catch (error) {
        new bs5.Toast({
            body: `Error al crear la tarea: ${error.message}`,
            className: 'border-0 bg-danger text-white',
        }).show();
    }

}

// Funcion para onclick de boton crear tarea
function createTaskBtn() {
    const title = $txtTitulo.value.trim();
    const description = $txtDescripcion.value.trim();

    if (!title) {
        new bs5.Toast({
            body: `Por favor, ingrese título`,
            className: 'border-0 bg-warning text-white',
        }).show();
        return;
    }

    try {

        create_task(title, description)
            .then(() => {
                renderTasks(arrayTasks);

                new bs5.Toast({
                    body: '¡Tarea creada!',
                    className: 'border-0 bg-success text-white',
                }).show();

                $txtTitulo.value = "";
                $txtDescripcion.value = "";
            })
            .catch(error => {
                throw new Error(error);
            });

    } catch (error) {
        new bs5.Toast({
            body: `Error al crear tarea: ${error}`,
            className: 'border-0 bg-danger text-white',
        }).show();
        return;
    }
}

// #endregion

// #region Modificar tareas

// Solicitud PUT para modificar tareas
async function update_task(idTask, title, description, completed) {
    const token = sessionStorage.getItem("access_token");

    try {

        const response = await fetch(`http://127.0.0.1:8000/api/tasks/update_task/${idTask}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: completed,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al crear la tarea');
        }

        // Actualizar task en arrayTasks para renderizar sustituyendo el objeto

        const updatedTask = await response.json();
        const index = arrayTasks.findIndex(task => task.id == idTask);
        arrayTasks[index] = updatedTask;
        
        modalCreate.hide();

    } catch (error) {
        new bs5.Toast({
            body: `Error al crear la tarea: ${error.message}`,
            className: 'border-0 bg-danger text-white',
        }).show();
    }

}

// Funcion para onclick de boton modificar tarea
function updateTaskBtn() {

    const idTask = $selectUpdateTask.value;
    const title = $txtUpdateTitulo.value.trim();
    const description = $textUpdateDescripcion.value.trim();
    const completed = $chkUpdateCompleted.checked ? true : false;

    if ($selectUpdateTask.value === "") {
        new bs5.Toast({
            body: `Por favor, seleccione una tarea`,
            className: 'border-0 bg-warning text-white',
        }).show();
        return        
    }

    if (!title) {
        new bs5.Toast({
            body: `Por favor, ingrese título`,
            className: 'border-0 bg-warning text-white',
        }).show();
        return;
    }

    try {

        update_task(idTask, title, description, completed)
            .then(() => {

                renderTasks(arrayTasks);
                renderTaskSelectOptions();
                new bs5.Toast({
                    body: '¡Tarea modificada!',
                    className: 'border-0 bg-success text-white',
                }).show();

                modalUpdate.hide();
                $txtUpdateTitulo.value = "";
                $textUpdateDescripcion.value = "";
                $chkUpdateCompleted.checked = false;
            })
            .catch(error => {
                throw new Error(error);
            });

    } catch (error) {
        new bs5.Toast({
            body: `Error al modificar tarea: ${error}`,
            className: 'border-0 bg-danger text-white',
        }).show();
        return;
    }

}

// #endregion

// #region Eliminar tareas

// Solicitud DELETE para eliminar tareas
async function delete_task(idTask) {

    const token = sessionStorage.getItem("access_token");

    try {

        const response = await fetch(`http://127.0.0.1:8000/api/tasks/delete_task/${idTask}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: idTask
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al crear la tarea');
        }

        // Eliminar elemento para renderizar
        const index = arrayTasks.findIndex(task => task.id == idTask);
        arrayTasks.splice(index, 1);
        
        modalCreate.hide();


    }catch (error) {
        new bs5.Toast({
            body: `Error al eliminar la tarea: ${error.message}`,
            className: 'border-0 bg-danger text-white',
        }).show();
    }
}

// Funcion para onclick de boton eliminar tarea
function deleteTaskBtn() {

    const idTask = $selectDeleteTask.value;

    if ($selectDeleteTask.value === "") {
        new bs5.Toast({
            body: `Por favor, seleccione una tarea`,
            className: 'border-0 bg-warning text-white',
        }).show();
        return        
    }

    try {

        delete_task(idTask)
            .then(() => {

                renderTasks(arrayTasks);
                renderTaskSelectOptions();

                new bs5.Toast({
                    body: '¡Tarea eliminada!',
                    className: 'border-0 bg-success text-white',
                }).show();

                modalDelete.hide();
            })
            .catch(error => {
                throw new Error(error);
            });

    } catch (error) {
        new bs5.Toast({
            body: `Error al eliminar tarea: ${error}`,
            className: 'border-0 bg-danger text-white',
        }).show();
        return;
    }

}

// #endregion

// #region Modales

function openModalCreate() {

    $txtTitulo.value = "";
    $txtDescripcion.value = "";    

    modalCreate.show();
}

function openModalUpdate() {

    $selectUpdateTask.value = "";
    $txtUpdateTitulo.value = "";
    $textUpdateDescripcion.value = "";
    $chkUpdateCompleted.checked = false

    modalUpdate.show();
}

function openModalDelete() {

    $selectDeleteTask.value = "";
    modalDelete.show();
}

// #endregion