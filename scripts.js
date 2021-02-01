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

transactions = [
  {
    description: 'Luz',
    amount: -20000,
    date: '01/02/2021'
  },
  {
    description: 'Freela JIC',
    amount: 120000,
    date: '15/02/2021'
  },
  {
    description: 'Freela Nerau',
    amount: 500000,
    date: '15/02/2021'
  }
]
const transaction = {
  all: transactions,
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
    transactions.forEach((el) => {
      if(el.amount > 0) {
        income += el.amount
      }
    })
    return income
  },
  expenses() {
    let expense = 0
    transactions.forEach((el) => {
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
  innerHTMLTransaction(transaction) {
    const cssClass = transaction.amount > 0 ? 'income' : 'expense'
    const amount = utils.formatCurrency(transaction.amount)
    const html = 
    `
    <td class="description">${transaction.description}</td>
    <td class="${cssClass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img src="assets/minus.svg" alt="Remover transação">
    </td>
    `
    return html
  },
  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)
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

const app = {
  init() {
    transaction.all.forEach((el) => {
      DOM.addTransaction(el)
    })
    DOM.updateBalance()    
  },
  reload() {
    DOM.clearTransactions()
    this.init()
  }
}
app.init()

transaction.add({
  description: 'Água',
  amount: -20000,
  date: '01/02/2021' 
})