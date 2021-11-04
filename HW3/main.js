{
  const size = prompt('enter size S, M, L, XL, XXL').toLocaleUpperCase()
  debugger
  switch (size) {
    case 'S': alert('Russian size 40');
      break;
    case 'M': alert('Russian size 42');
      break;
    case 'L': alert('Russian size 46');
      break;
    case 'XL': alert('Russian size 50');
      break;
    case 'XXL': alert('Russian size 54');
      break;
    default: alert('Please, enter correct size S, M, L, XL, XXL')
  }
}

{
  let color = prompt("Введите цвет", "");
  if (color === 'red') {
    document.write("<div style='background-color: red;'>красный</div>");
  } else if (color === 'black') {
    document.write("<div style='background-color: black;'>красный</div>");
  } else if (color === 'blue') {
    document.write("<div style='background-color: blue;'>красный</div>");
  } else if (color === 'green') {
    document.write("<div style='background-color: green;'>красный</div>");
  } else {
    document.write("<div style='background-color: gray;'>Я не понял</div>");
  }
}

{
  +prompt('How age are you?') || alert('Error')
}

{
  confirm('шопинг?') || alert('ты - бяка')
}

{
  let shoping = confirm('шопинг?')
  if (!shoping) {
    alert('ты - бяка')
  }
}

{
  let surname = prompt("Твоя фамилия?")
  let name = prompt("Твое имя?")
  let patronymic = prompt("Твое отчество?")
  alert(patronymic + " " + name + " " + surname)
}

{
  let surname = prompt("Твоя фамилия?") || "Иванович"
  let name = prompt("Твое имя?") || "Иван"
  let patronymic = prompt("Твое отчество?") || "Иванов"
  alert(patronymic + " " + name + " " + surname)
}

let admin = prompt("Enter login")
if (admin !== 'admin') {
  alert('Error login')
} else {
  let password = prompt("Enter password")
  if (password !== 'qwerty') {
    alert('Error password')
  } else {
    alert('Welcome')
  }
}


{
  let curr = prompt('"usd" или "eur"').toLocaleLowerCase()
  let change = confirm("Покупаем?")
  debugger
  switch (curr) {
    case "usd":
      change ? alert((prompt('Введите суму в грн') / 26.02).toFixed(2) + ' usd') : alert((prompt('Введите суму в грн') / 26.47).toFixed(2) + ' usd')
      break;
    case "eur":
      change ? alert((prompt('Введите суму в грн') / 29.98).toFixed(2) + ' eur') : alert((prompt('Введите суму в грн') / 30.61).toFixed(2) + ' eur')
      break
    default:
      alert('Не указана валюта "usd" или "eur"')
      break;
  }
}

{
  let curr = prompt('"usd" или "eur"').toLocaleLowerCase()
  let change = confirm("Покупаем?")
  if (curr === "usd") {
    if (change) {
      alert((prompt('Введите суму в грн') / 26.02).toFixed(2) + ' usd')
    } else {
      alert((prompt('Введите суму в грн') / 26.47).toFixed(2) + ' usd')
    }
  } else if (curr === "eur") {
    if (change) {
      alert((prompt('Введите суму в грн') / 29.98).toFixed(2) + ' eur')
    } else {
      alert((prompt('Введите суму в грн') / 30.61).toFixed(2) + ' eur')
    }
  } else {
    alert('Не указана валюта "usd" или "eur"')
  }
}

{
  let arrWord = ['камень', 'ножницы', 'бумага']
  let userHit = prompt("Введите камень или ножницы или бумага").toLocaleLowerCase()
  if (userHit === 'камень' || userHit === 'ножницы' || userHit === 'бумага') {
    let randomWord = Math.floor(Math.random() * arrWord.length)
    alert(arrWord[randomWord])
    if (userHit === arrWord[randomWord]) {
      alert('Ничья')
    } else if (userHit === 'камень' && arrWord[randomWord] === 'ножницы') {
      alert("Выиграл")
    } else if (userHit === 'ножницы' && arrWord[randomWord] === 'бумага') {
      alert("Выиграл")
    } else if (userHit === 'бумага' && arrWord[randomWord] === 'камень') {
      alert("Выиграл")
    } else {
      alert("Проиграл")
    }
  } else {
    alert('Тебя ж просили ввести камень или ножницы или бумага')
  }
}
