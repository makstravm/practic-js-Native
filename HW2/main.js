{
  var a = 5;
  var b, c;

  b = (a * 5)
  b = (c = (b / 2))
}

{
  const year = new Date().getFullYear();
  const age = prompt("How old are you?")
  age === null ? alert('Please enter your age') : alert(year - age)
}


{
  const celsius = +prompt('what is the temperature in celsius ?')
  const fahrenheit = celsius * 1.8 + 32;
  alert('Faringate temperature ' + fahrenheit)
}

{
  const numberOne = +prompt('Please, enter number one')
  const numberTwo = +prompt('Please, enter number two')
  alert(numberOne / Math.floor(numberTwo))
}

{
  const number = +prompt('Please, enter number ')
  if (isNaN(number)) {
    alert('Please, enter number correct')
  } else if (number % 2 === 0) {
    alert('number is even')
  } else {
    alert('number is odd')
  }
}

{
  const name = prompt("what's your name?")
  alert('Hi, ' + name)
}

{
  const word = prompt('Enter a word ')
  word.includes('dniwe') ? alert('Plese enter correct a word') : alert(word)
}

{
  const checkDrunk = confirm('Are you drunk?')
  console.log(checkDrunk);

  const checkMarried = confirm("are you married?")
  if (checkMarried) {
    alert('married')
  } else {
    alert('not married')
  }

  let myArray = ['Vodka', 'Cognac', 'Whiskey', 'Beer', 'Rum']

  const newArray = [...myArray, checkDrunk, checkMarried]
  console.log(newArray);

  const arrayPlus = newArray[0] + newArray[1]
  console.log(arrayPlus);

  myArray[2] = arrayPlus
  console.log(myArray);
}

{
  let myNotebook = {
    model: 'Asus',
    seria: 'n53',
    age: '2011',
    batteryСharge: 78,
    userName: 'Maxim'
  }
  console.log(myNotebook);
  myNotebook.model = 'Acer'
  myNotebook['userName'] = 'Viktoria'
  console.log(myNotebook);
}

{
  var age = +prompt("Сколько вам лет?", "");
  if (age < 18) {
    alert("школьник");
  }
  else {
    if (age < 30) {
      alert("молодеж");
    }
    else {
      if (age < 45) {
        alert("зрелость");
      }
      else {
        if (age < 60) {
          alert("закат");
        }
        else {
          if (age > 60) {
            alert("как пенсия?");
          }
          else {
            alert("то ли киборг, то ли ошибка");
          }
        }
      }
    }
  }
}

{
  const size = prompt('enter size S, M, L, XL, XXL')
  if (size === 'S') {
    alert('Russian size 40')
  } else if (size === 'M') {
    alert('Russian size 42')
  } else if (size === 'L') {
    alert('Russian size 46')
  } else if (size === 'XL') {
    alert('Russian size 50')
  } else if (size === 'XXL') {
    alert('Russian size 54')
  } else {
    alert('Please, enter correct size S, M, L, XL, XXL')
  }
}

{
  const convectSize = {
    S: 40,
    M: 42,
    L: 46,
    XL: 50,
    XXL: 54
  }
  const size = prompt('enter size S, M, L, XL, XXL').toLocaleUpperCase()
  if (size === 'S' || size === 'M' || size === 'L' || size === 'XL' || size === 'XXL') {
    alert('Russian size ' + convectSize[size])
  } else {
    alert('Please, enter correct size S, M, L, XL, XXL')
  }
}

{
  confirm('Are you man?') ? alert('You are man') : alert(' You are woman')
}

{
  const floors = 9
  const apartmentsInTheFloor = 4
  const numberApartment = 81

  const apartmentsEntrance = (floors * apartmentsInTheFloor)
  const resultEntrance = Math.ceil(numberApartment / apartmentsEntrance)
  const remainderApartment = numberApartment % apartmentsEntrance
  const  resultFlors
  if (remainderApartment === 0) {
    resultFlors = Math.ceil((remainderApartment + apartmentsEntrance) / apartmentsInTheFloor)
    console.log("подьезд " + resultEntrance, "этаж " + resultFlors1);
  } else {
    resultFlors = Math.ceil(remainderApartment / apartmentsInTheFloor)
    console.log("подьезд " + resultEntrance, "этаж " + resultFlors);
  }
}




