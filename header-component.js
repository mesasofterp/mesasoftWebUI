fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.body.insertAdjacentHTML('afterbegin', data);
  })
  .catch(error => console.error('Header yüklenemedi:', error));