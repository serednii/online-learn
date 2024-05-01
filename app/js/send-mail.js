const mailPath = 'http://nastya03.zzz.com.ua/send-mail.php';

function formDataToObject(formData) {
  let jsonObject = {};
  for (const [key, value] of formData.entries()) {
    jsonObject[key] = value;
  }
  return jsonObject;
}

function clearForm(formElement){
  formElement.target.querySelectorAll('input:not([type="hidden"]) ,textarea').forEach(e => {
      e.checked  = e.defaultChecked;
      e.value = "";
  })
}

document.querySelectorAll('.send-form-mail').forEach((el) => {

  el.addEventListener('submit', function (e) {
    console.log(e.target)
    e.preventDefault()
    const data = formDataToObject(new FormData(this))

    if(!validateEmail(data.email)){
      alert('Email no valid')
      return;
    }
    
    // console.log(data)

    fetch(mailPath, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json' //application/json  multipart/form-data
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data),
      // body: params,
    })
      .then(response => response.json())
      .then(result => {
        // Обробка відповіді від сервера
        if (result.success) {
          alert("Письмо отправлено");
          clearForm(e)
          // e.target.querySelectorAll('textarea').forEach(e => e.value = "")
        } else {
          alert("Письмо не отправлено произошла ошибка:  " + result.message);
        }
      })
      .catch(error => {
        console.error('Помилка:', error);
      });
  })

})


