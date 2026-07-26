fetch("Form.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("appointmentContainer").innerHTML = data;

        initAppointment();

    });


function initAppointment() {

    const overlay = document.getElementById("appointmentOverlay");

    document.querySelectorAll(".bookBtn").forEach(btn => {

        btn.addEventListener("click", function (e) {

            e.preventDefault();

            overlay.classList.add("active");

        });

    });

    document.getElementById("closeAppointment").addEventListener("click", () => {

        overlay.classList.remove("active");

    });

    document.getElementById("cancelAppointment").addEventListener("click", () => {

        overlay.classList.remove("active");

    });
  
    overlay.addEventListener("click", function (e) {

        if (e.target === overlay) {

            overlay.classList.remove("active");

        }

    });

    const form = document.getElementById("appointmentForm");

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const appointment = {

            full_name: document.getElementById("fullName").value,

            phone: document.getElementById("phone").value,

            email: document.getElementById("email").value,

            age: document.getElementById("age").value,

            service: document.getElementById("service").value,

            doctor: document.getElementById("doctor").value,

            appointment_date: document.getElementById("date").value,

            appointment_time: document.getElementById("time").value,

            notes: document.getElementById("notes").value,

            status: "Pending"

        };

        console.log(appointment);

        const { data, error } = await supabaseClient
            .from("appointments")
            .insert([appointment])
            .select();

        if (error) {

            console.error(error);

            alert(error.message);

            return;

        }

        console.log(data);

        alert("Appointment Booked Successfully 🎉");

        form.reset();

        overlay.classList.remove("active");

    });

}
