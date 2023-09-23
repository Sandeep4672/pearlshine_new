const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
  const buttonElement = event.target;
  const repId = buttonElement.dataset.repid;
  const csrfToken = buttonElement.dataset.csrf;

 // console.log(doctorId);
  const response = await fetch('/admin/reps/' + repId + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });

  if (!response.ok) {
    //console.log("HI");
    alert('Something went wrong!');
    return;
  }
  //console.log("Reached Here")
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}