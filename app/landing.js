// Create the main elements
const head = document.createElement('head');
const body = document.createElement('body');

// Set up the head
head.innerHTML = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
`;

// Create and append the style element
const style = document.createElement('style');
style.textContent = `
    body {
        background-color: #0f0f0f;
        color: #fff;
        font-family: 'Courier New', Courier, monospace;
        font-weight: normal;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        flex-direction: column;
        text-align: center;
    }
    h1 {
        font-size: 2.5rem;
        font-weight: normal;
    }
    .btn-schedule {
        margin-top: 20px;
        padding: 10px 30px;
        background-color: #6200ea;
        color: #fff;
        border: none;
        border-radius: 50px;
        font-size: 1.5rem;
        cursor: pointer;
    }
`;
head.appendChild(style);

// Set up the body
const button = document.createElement('button');
button.className = 'btn-schedule';
button.textContent = 'automate it';
button.onclick = openModal;

const modal = document.createElement('div');
modal.className = 'modal';
modal.style.display = 'none';
modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <form id="contact-form">
            <input type="text" placeholder="Name" required>
            <input type="email" placeholder="Email" required>
            <textarea placeholder="Message" required></textarea>
            <button type="submit">Submit</button>
        </form>
    </div>
`;

body.appendChild(modal);

function openModal() {
    modal.style.display = 'block';
}

const closeBtn = modal.querySelector('.close');
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

const contactForm = document.getElementById('contact-form');
contactForm.onsubmit = function(e) {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
    modal.style.display = 'none';
}

// Append head and body to the document
document.documentElement.appendChild(head);
document.documentElement.appendChild(body);