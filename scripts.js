const utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''
    value = String(value).replace(/\D/g, '')
    value = Number(value) / 100
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value
  },
  formatAmount(value) {
    value = value * 100
    return Math.round(value)
  },
  formatDate(value) {
    const splittedDate = value.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
}

const modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active')
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active')
  } 
}

let COLOR_THEME = window.matchMedia("(prefers-color-scheme: light)").matches ? 'light' : 'dark'
const invertTheme = (mediaText) => mediaText.indexOf('dark') > -1
  ? ['dark', 'light']
  : ['light', 'dark']
function switchTheme() {  
  const cssRules = window.document.styleSheets[1].cssRules
 
  for (const rule of cssRules) {
    let media = rule.media
    
    if (media) {
      const [currentTheme, nextTheme] = invertTheme(media.mediaText)

      media.mediaText = media
      .mediaText
      .replace(
        "(prefers-color-scheme: " + currentTheme + ")", 
        "(prefers-color-scheme: " + nextTheme + ")",
      )
    }
  }
}

const storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
  },
  set(transactions) {
    localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions))
  }
}
storage.get()

const transaction = {
  all: storage.get(),
  add(trans) {
    this.all.push(trans)
    app.reload()
  },
  remove(index) {
    this.all.splice(index, 1)
    app.reload()
  },

  incomes() {
    let income = 0
    this.all.forEach((el) => {
      if(el.amount > 0) {
        income += el.amount
      }
    })
    return income
  },
  expenses() {
    let expense = 0
    this.all.forEach((el) => {
      if(el.amount < 0) {
        expense += el.amount
      }
    })
    return expense
  },
  total() {
    let total = 0
    return this.incomes() + this.expenses()
  }
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),
  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? 'income' : 'expense'
    const amount = utils.formatCurrency(transaction.amount)
    const html = 
    `
    <td class="description">${transaction.description}</td>
    <td class="${cssClass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img src="assets/minus.svg" alt="Remover transação" onclick="transaction.remove(${index})">
    </td>
    `
    return html
  },
  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index
    this.transactionContainer.appendChild(tr)
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(transaction.incomes())
    document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(transaction.expenses())
    document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(transaction.total())
  },

  clearTransactions() {
    this.transactionContainer.innerHTML = ''
  }
}

const form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  getValues() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value
    }
  },
  validateFields() {
    const {description, amount, date} = this.getValues()
    if(description.trim() == '' || amount.trim() == '' || date.trim() == '') {
      throw new Error("Todos os campos devem ser preenchidos!")
    }
  },
  formatValues() {
    let {description, amount, date} = this.getValues()
    amount = utils.formatAmount(amount)
    date = utils.formatDate(date)
    return {description, amount, date}
  },
  saveTransaction(trans) {
    transaction.add(trans)
  },
  clearFields() {
    this.description.value = ""
    this.amount.value = ""
    this.date.value = ""
  },

  submit(event) {
   event.preventDefault()
   try {
     this.validateFields()
     const transaction = this.formatValues()
     this.saveTransaction(transaction)
     this.clearFields()
     modal.close()
   } catch (error) {
     alert(error.message)
   }
  },
}

const app = {
  init() {
    transaction.all.forEach((el, index) => {
      DOM.addTransaction(el, index)
    })
    DOM.updateBalance()
    storage.set(transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    this.init()
  }
}
app.init()