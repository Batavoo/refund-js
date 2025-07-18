// Seleciona os elementos do formulario
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// seleciona os elementos da lista.
const expenseList = document.querySelector("ul ");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // obatem o valor atual do input, e remove os caracteres nao numericos
  let value = amount.value.replace(/\D/g, "");

  // Transformar o valor em centavos.
  value = Number(value) / 100;

  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // Formata o valor no padrao BRL (real brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

// Captura o evento de submito do form para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrao de recarregar a pagina
  event.preventDefault();

  // Cria um objeto com os detalhes da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };
  // Chama a funcao que ira adicionar o novo item na lista
  expenseAdd(newExpense);
};

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o icone da categoria.
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona nome e categoria na div das informacoes da despesa.
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria o icone de remover
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");
    // Adiciona as informacoes no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item na lista
    expenseList.append(expenseItem);

    // Limpa os campos
    formClear();

    // Atualiza os totais
    updateTotals();
  } catch (error) {
    alert("Nao foi possivel atualizar a lista de despesas");
    console.log(error);
  }
}

// Atualiza os totais.
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children;

    // Atualiza a quantidade de itens da lista
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Variavel para incrementar o total
    let total = 0;

    // percore cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remove caracteres nao numericos e sbustitui a virgula pelo ponto
      let value = itemAmount.textContent
        .replace(/[^\d, ]/g, "")
        .replace(",", ".");

      // converte o valor para float.
      value = parseFloat(value);

      // verificar se e um numero valido
      if (isNaN(value)) {
        return alert(
          "Nao foi possivel calcular o total. O valor nao parece ser um numero"
        );
      }

      // Incrementar o valor total.
      total += Number(value);
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");
    expensesTotal.innerHTML = "";
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("Nao foi possivel atualizr os totais");
  }
}

// evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", (event) => {
  // verifica se o elemento clicado e o icone de remover
  if (event.target.classList.contains("remove-icon")) {
    // obatem a li pai do elemento clicado
    const item = event.target.closest(".expense");
    // remove o item da lista
    item.remove();
  }

  // atualiza os totais
  updateTotals();
});

// Limpar os campos depois de adicionar um li
function formClear() {
  // Limpa os inputs.
  expense.value = "";
  category.value = "";
  amount.value = "";

  // Coloca o foco no input de amount
  expense.focus();
}
