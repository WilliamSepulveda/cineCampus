document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login_form');
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
          alert('Por favor ingrese un correo electrónico válido.');
          return;
        }
  
        try {
          const url = `${e.target.action}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
          
          
          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert(result.message); 
            window.location.href = result.redirectUrl; 
          } else {
            alert(result.message); 
          }
        } catch (error) {
          console.error('Error durante el inicio de sesión:', error);
          alert(`Ocurrió un error durante el inicio de sesión: ${error.message}`);
        }
      });
    }
  });
  