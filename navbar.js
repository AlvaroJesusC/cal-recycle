// Cargar navbar
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
        
        // Resaltar página actual
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const links = document.querySelectorAll('nav a[data-page]');
        
        links.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.style.color = '#00d4aa';
            }
        });
    });