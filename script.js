const WHATSAPP_NUMBER = "5528992757243";

const form = document.querySelector("#booking-form");
const dateInput = document.querySelector("#appointment-date");
const timeSelect = document.querySelector("#appointment-time");
const serviceSelect = document.querySelector("#patient-service");
const feedback = document.querySelector("#form-feedback");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (window.lucide) {
  window.lucide.createIcons();
}

const today = new Date();
const minimumDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);
dateInput.min = minimumDate;

function updateTimeOptions() {
  const chosenDate = dateInput.value ? new Date(`${dateInput.value}T12:00:00`) : null;
  const isSaturday = chosenDate?.getDay() === 6;
  const openingHour = 8;
  const closingHour = isSaturday ? 13 : 19;
  const selectedTime = timeSelect.value;

  timeSelect.replaceChildren(new Option("Escolha o horário", "", true, true));
  timeSelect.options[0].disabled = true;

  for (let hour = openingHour; hour < closingHour; hour += 1) {
    for (const minute of [0, 30]) {
      if (isSaturday && hour === 12 && minute === 30) continue;
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      timeSelect.add(new Option(time, time));
    }
  }

  if ([...timeSelect.options].some((option) => option.value === selectedTime)) {
    timeSelect.value = selectedTime;
  }
}

dateInput.addEventListener("change", () => {
  const chosenDate = new Date(`${dateInput.value}T12:00:00`);
  if (chosenDate.getDay() === 0) {
    dateInput.setCustomValidity("A clínica não abre aos domingos. Escolha outro dia.");
    dateInput.reportValidity();
    dateInput.value = "";
  } else {
    dateInput.setCustomValidity("");
  }
  updateTimeOptions();
});

serviceSelect.addEventListener("change", () => {
  serviceSelect.setCustomValidity("");
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const requestedService = link.dataset.service;
    const matchingOption = [...serviceSelect.options].find(
      (option) => option.text === requestedService,
    );
    if (matchingOption) serviceSelect.value = matchingOption.value;
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  mainNav.classList.toggle("is-open", !isOpen);
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? "menu" : "x"}" aria-hidden="true"></i>`;
  if (window.lucide) window.lucide.createIcons();
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    mainNav.classList.remove("is-open");
    menuToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
    if (window.lucide) window.lucide.createIcons();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  feedback.textContent = "";

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const [year, month, day] = formData.get("date").split("-");
  const message = [
    "Oi! Gostaria de verificar se há disponibilidade para agendar na Gayve Odontologia.",
    "",
    `Nome: ${formData.get("name")}`,
    `WhatsApp: ${formData.get("phone")}`,
    `Atendimento: ${formData.get("service")}`,
    `Data preferida: ${day}/${month}/${year}`,
    `Horário preferido: ${formData.get("time")}`,
    formData.get("message") ? `Observação: ${formData.get("message")}` : "",
  ].filter(Boolean).join("\n");

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
  feedback.textContent = "Envie a mensagem para a equipe verificar a disponibilidade e confirmar ou sugerir outro horário.";
});

updateTimeOptions();