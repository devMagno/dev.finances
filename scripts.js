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

const transaction = {
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
  }
}
transactions.forEach((el) => {
  DOM.addTransaction(el)
})
DOM.updateBalance()