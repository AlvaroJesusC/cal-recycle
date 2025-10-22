// Modal functionality
    const modal = document.getElementById('modalOverlay');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('addPointForm');

    // Abrir modal
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    });

    // Cerrar modal
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      form.reset();
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Enviar formulario
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoriaModal').value,
        direccion: document.getElementById('direccion').value,
        distrito: document.getElementById('distritoModal').value,
        horario: document.getElementById('horario').value,
        descripcion: document.getElementById('descripcion').value
      };

      console.log('Nuevo punto agregado:', formData);
      
      // Aquí puedes agregar código para enviar los datos a un servidor
      alert('¡Punto ecológico agregado exitosamente! 🌿\n\nGracias por contribuir a la comunidad.');
      
      closeModal();
    });