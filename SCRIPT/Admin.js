const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const appointmentList = document.getElementById("appointment-list");
const selectedDate = document.getElementById("selectedDate");

const today = new Date();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function renderCalendar() {

    calendarDays.innerHTML = "";

    monthYear.innerText = `${months[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("span");

        calendarDays.appendChild(empty);

    }
  
    for (let day = 1; day <= totalDays; day++) {

        const dateBox = document.createElement("span");

        dateBox.innerText = day;

        const fullDate =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {

            dateBox.classList.add("today");

        }

        dateBox.addEventListener("click", () => {

            document
                .querySelectorAll("#calendarDays span")
                .forEach(item => item.classList.remove("selected"));

            dateBox.classList.add("selected");

            loadAppointments(fullDate);

        });

        calendarDays.appendChild(dateBox);

    }
    highlightAppointmentDates();

}

async function loadAppointments(date) {

    appointmentList.innerHTML = `
    
        <div class="no-appointment">

            <h3>Loading...</h3>

        </div>

    `;

    selectedDate.innerText = `Appointments - ${date}`;

    const { data, error } = await supabaseClient

        .from("appointments")

        .select("*")

        .eq("appointment_date", date)

        .order("appointment_time", { ascending: true });

    if (error) {

        console.error(error);

        appointmentList.innerHTML = `

            <div class="no-appointment">

                <h3>Error Loading Appointments</h3>

                <p>${error.message}</p>

            </div>

        `;

        return;

    }

    displayAppointments(data, date);

}

function displayAppointments(data, date) {

    appointmentList.innerHTML = "";

    selectedDate.innerText = `Appointments - ${date}`;

    if (data.length === 0) {

        appointmentList.innerHTML = `

            <div class="no-appointment">

                <i class="ri-calendar-close-line"></i>

                <h3>No Appointment</h3>

                <p>No appointments for this date.</p>

            </div>

        `;

        return;

    }

    data.forEach(item => {

        appointmentList.innerHTML += `

            <div class="appointment">

                <div class="appointment-info">

                    <h3>${item.appointment_time.substring(0,5)}</h3>

                    <p>${item.full_name}</p>

                    <small>${item.service}</small>

                </div>

                <div class="appointment-right">

                    <span class="status ${item.status.toLowerCase()}">
                        ${item.status}
                    </span>

                    <div class="appointment-buttons">

                        ${
                            item.status === "Pending"
                            ?
                            `
                            <button class="complete-btn"
                                onclick="completeAppointment('${item.appointment_id}')">

                                <i class="ri-check-line"></i>


                            </button>
                            `
                            :
                            `
                            <button class="completed-btn" disabled>

                                <i class="ri-checkbox-circle-fill"></i>

                            </button>
                            `
                        }

                        <button class="delete-btn"
                            onclick="deleteAppointment('${item.appointment_id}')">

                            <i class="ri-delete-bin-6-line"></i>


                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}

async function highlightAppointmentDates() {

    const firstDate =
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;

    const lastDay =
        new Date(currentYear, currentMonth + 1, 0).getDate();

    const lastDate =
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${lastDay}`;

    const { data, error } = await supabaseClient

        .from("appointments")

        .select("appointment_date")

        .gte("appointment_date", firstDate)

        .lte("appointment_date", lastDate);

    if (error) {

        console.error(error);

        return;

    }

    const appointmentDates = data.map(item => item.appointment_date);

    document.querySelectorAll("#calendarDays span").forEach(dayBox => {

        if (dayBox.innerText === "") return;

        const fullDate =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayBox.innerText).padStart(2, "0")}`;

        if (appointmentDates.includes(fullDate)) {

            dayBox.classList.add("active");

        }

    });

}

function changeMonth(direction) {

    currentMonth += direction;

    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;

    }

    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;

    }

    renderCalendar();

    appointmentList.innerHTML = "";

    selectedDate.innerText = "Appointments";

    const firstDate =
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;

    loadAppointments(firstDate);

}

async function completeAppointment(id) {

    const { error } = await supabaseClient
        .from("appointments")
        .update({
            status: "Completed"
        })
        .eq("appointment_id", id);

    if (error) {
        alert(error.message);
        return;
    }

    loadAppointments(currentSelectedDate);

}

async function deleteAppointment(id) {

    if (!confirm("Delete this appointment?")) return;

    const { error } = await supabaseClient
        .from("appointments")
        .delete()
        .eq("appointment_id", id);

    if (error) {
        alert(error.message);
        return;
    }

    loadAppointments(currentSelectedDate);

}

async function initDashboard() {

    renderCalendar();

    const todayKey =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    await loadAppointments(todayKey);

}

document
.getElementById("prevMonth")
.addEventListener("click",()=>{

    changeMonth(-1);

});

document
.getElementById("nextMonth")
.addEventListener("click",()=>{

    changeMonth(1);

});

initDashboard();
