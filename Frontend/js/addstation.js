// Form Step Management
let currentStep = 1;
const totalSteps = 4;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('addStationForm');

// Show/Hide Steps
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((el, index) => {
        if (index + 1 <= step) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
    
    // Update button visibility
    if (step === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
        prevBtn.style.display = 'flex';
    } else if (step === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
    
    // Update review on step 4
    if (step === totalSteps) {
        updateReview();
    }
}

// Validate Current Step
function validateStep(step) {
    const requiredFields = document.querySelectorAll(`#step${step} [required]`);
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioGroup = form.querySelectorAll(`[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(r => r.checked);
            if (!isChecked) {
                isValid = false;
                field.closest('.form-group').classList.add('error');
            }
        } else if (field.value.trim() === '') {
            isValid = false;
            field.closest('.form-group').classList.add('error');
            field.focus();
        } else {
            field.closest('.form-group')?.classList.remove('error');
        }
    });
    
    return isValid;
}

// Next Button
nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// Previous Button
prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Update Review
function updateReview() {
    document.getElementById('reviewStationName').textContent = form.stationName.value || '-';
    document.getElementById('reviewStatus').textContent = form.status.value || '-';
    document.getElementById('reviewAddress').textContent = form.address.value || '-';
    document.getElementById('reviewCity').textContent = form.city.value || '-';
    document.getElementById('reviewState').textContent = form.state.value || '-';
    document.getElementById('reviewZipcode').textContent = form.zipcode.value || '-';
    
    const chargerType = form.querySelector('input[name="chargerType"]:checked')?.value || '-';
    document.getElementById('reviewChargerType').textContent = chargerType.replace('-', ' ').toUpperCase();
    
    document.getElementById('reviewPrice').textContent = form.pricePerKwh.value ? `$${form.pricePerKwh.value}/kWh` : '-';
    document.getElementById('reviewTotalSlots').textContent = form.totalSlots.value || '-';
    document.getElementById('reviewAvailableSlots').textContent = form.availableSlots.value || '-';
}

// Validate Available Slots
form.addEventListener('change', (e) => {
    if (e.target.name === 'totalSlots') {
        const totalSlots = parseInt(form.totalSlots.value) || 0;
        const availableSlots = parseInt(form.availableSlots.value) || 0;
        
        if (availableSlots > totalSlots) {
            form.availableSlots.value = totalSlots;
        }
        form.availableSlots.max = totalSlots;
    }
});

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!document.getElementById('agreement').checked) {
        alert('Please agree to the terms and conditions');
        return;
    }
    
    if (validateStep(totalSteps)) {
        // Collect form data
        const ownerId = localStorage.getItem("userId");

const formData = {

    stationName: form.stationName.value,
    address: form.address.value,
    city: form.city.value,
    chargerType: form.querySelector('input[name="chargerType"]:checked').value,
    pricePerKwh: form.pricePerKwh.value,
    totalSlots: form.totalSlots.value,
    availableSlots: form.availableSlots.value,
    status: form.status.value,

    owner:{
        id: ownerId
    }

};
        
        console.log('[v0] Submitting station:', formData);
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Station...';
        
        // Simulate API call
        fetch("http://localhost:8080/saveStation", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {

    const successModal = document.getElementById("successModal");
    successModal.classList.add("active");

    form.reset();

    currentStep = 1;
    showStep(1);

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Add Station';

})
.catch(error => {

    console.error(error);

    alert("Station not added");

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Add Station';

});
    }
});

// Redirect to Dashboard
function redirectToDashboard() {
    window.location.href = 'stationownerdashboard.html';
}

// Real-time Validation
form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('change', () => {
        if (field.hasAttribute('required') && field.value.trim() !== '') {
            field.closest('.form-group')?.classList.remove('error');
        }
    });
});

// Initialize
showStep(1);

// Dark Mode Detection
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.style.colorScheme = 'dark';
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
});