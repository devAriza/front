d = document;



let arrayForCount = []
get_tasks()
    .then(() => {

        let countPendiente = arrayForCount.filter(task => !task.completed).length;
        let countFinalizada = arrayForCount.filter(task => task.completed).length;
        const cards = document.querySelectorAll('.col-md-6.col-xl-3 .card-body');

        cards[0].querySelector('.text-dark span').textContent = countPendiente;
        cards[1].querySelector('.text-dark span').textContent = countFinalizada;
        cards[2].querySelector('.text-dark span').textContent = countPendiente + countFinalizada;


        const chartCanvas = document.querySelector('.chart-area canvas');
        const newChartData = {
            type: 'doughnut',
            data: {
                labels: ['Pendientes', 'Finalizadas'],
                datasets: [{
                    label: '',
                    backgroundColor: ['#ffc107', '#0dcaf0'],
                    borderColor: ['#ffffff', '#ffffff'],
                    data: [countPendiente, countFinalizada]
                }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    labels: {
                        fontStyle: 'normal'
                    }
                },
                title: {
                    fontStyle: 'normal'
                }
            }
        };

        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        chartCanvas.chart = new Chart(chartCanvas.getContext('2d'), newChartData);

    })
    .catch(error => {
        new bs5.Toast({
            body: `Error al obtener información de tareas: ${error}`,
            className: 'border-0 bg-danger text-white',
        }).show();
    }
    );

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
            throw new Error(`Error HTTP: ${response.status}`);
        }

        arrayForCount = await response.json();

    } catch (error) {
        new bs5.Toast({
            body: `Error de conexión: ${error}`,
            className: 'border-0 bg-warning text-white',
        }).show();
        return;
    }

}