document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 
  
    const nick = document.getElementById('nick').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/user/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nick, email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Cuenta creada exitosamente. Serás redirigido al inicio de sesión.');
        window.location.href = '/log_in'; 
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al crear la cuenta. Inténtalo de nuevo.');
    }
  });
  