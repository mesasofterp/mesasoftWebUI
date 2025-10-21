fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    document.body.insertAdjacentHTML('beforeend', data); // <-- beforeend ile body sonuna ekler
  })
  .catch(error => console.error('footer yüklenemedi:', error));
