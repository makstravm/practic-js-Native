fetch('https://open.er-api.com/v6/latest/USD').then(res => res.json())
  .then(data => {
    const currencyArray = Object.keys(data.rates)
    const currencyObj = data.rates;
    const updateDateTime = data.time_last_update_utc
    const selectCurrency = document.querySelectorAll('select.currency')
    const currencyOne = document.getElementById('currencyOne')
    const currencyTwo = document.getElementById('currencyTwo')
    const numberOne = document.getElementById('numberOne')
    const numberTwo = document.getElementById('numberTwo')
    const todayDate = document.getElementById('todayDate')

    todayDate.innerText = `${updateDateTime.slice(0, 16)}`

    for (let i = 0; i < selectCurrency.length; i++) {
      currencyArray.map(c => {
        let option = document.createElement("option")
        option.setAttribute('value', c)
        option.text = `${c}`
        selectCurrency[i].appendChild(option)
      })
    }

    const calcCurrency = () => {
      if (currencyOne.value === currencyTwo.value) {
        numberTwo.value = numberOne.value
      } else {
        let result = numberOne.value / currencyObj[currencyOne.value] * currencyObj[currencyTwo.value]
        numberTwo.value = result.toFixed(3)
      }
    }

    currencyOne.addEventListener("change", function () {
      calcCurrency()
    })

    currencyTwo.addEventListener("change", function () {
      calcCurrency()
    })

    numberOne.addEventListener("change", function () {
      calcCurrency()
    })
  })