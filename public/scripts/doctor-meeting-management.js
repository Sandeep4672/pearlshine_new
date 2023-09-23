const deleteProductButtonElements = document.querySelectorAll('.product-item-actions button');

async function deleteProduct(event) {
  const buttonElement = event.target.closest('button');
  const meetingId = buttonElement.dataset.meetingid;
  const csrfToken = buttonElement.dataset.csrf;


  console.log("1",meetingId);
  const response = await fetch('/admin/doctors/meetings/' + meetingId + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });

  if (!response.ok) {
    //console.log("HI");
    alert('Something went wrong!');
    return;
  }
 // console.log("Reached Here")
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}