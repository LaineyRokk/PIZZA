// TODO: Display Customer Information + Comment from Array
// TODO: Fix "undefined" bug from adding pizzas w/o selecting size or cheese
// TODO: Use switch instead of if

// =========================================== //
//                  Back End                   //
// =========================================== //

var name = prompt("Enter a name");

function Pizza(pizzaSize, cheese, appetizer) {
  this.pizzaSize = pizzaSize;
  this.cheese = cheese;
  this.appetizer = appetizer;
  this.vegToppings = [];
  this.meatToppings = [];
  this.gourmetToppings = [];
  this.customerComment = [];
}

Pizza.prototype.addToppingMeat = function(meat) {
  this.meatToppings.push(meat);
}

Pizza.prototype.addToppingVeggie = function(veggie) {
  this.vegToppings.push(veggie);
}

Pizza.prototype.addToppingGourmet = function(gourmet) {
  this.gourmetToppings.push(gourmet);
}

Pizza.prototype.addCustomerComment = function(comment) {
  this.customerComment.push(comment);
}

Pizza.prototype.refreshCost = function() {
  var cost = 0;
  if (this.pizzaSize === "Mini") {
    cost = 9;
  } else if (this.pizzaSize === "Small") {
    cost = 12;
  } else if (this.pizzaSize === "Medium") {
    cost = 15;
  } else if (this.pizzaSize === "Large") {
    cost = 18;
  } else if (this.pizzaSize === "Giant") {
    cost = 22;
  }
  this.meatToppings.forEach(function() {
    cost += 1.25;
  });
  this.vegToppings.forEach(function() {
    cost += 0.75;
  });
  if (this.cheese === "extra") {
    cost += 1;
  }
  if (this.appetizer === "Breadsticks") {
    cost += 6;
  }
  this.gourmetToppings.forEach(function() {
    cost += 1.75;`  `
  });
  this.cost = cost;
}

function Order(customerName, customerAddress, customerPhone) {
  this.customerName = customerName;
  this.customerAddress = customerAddress;
  this.customerPhone = customerPhone;
  this.pizzas = [];
}

Order.prototype.addPizza = function(pizza) {
  pizza.refreshCost();
  this.pizzas.push(pizza);
}

Order.prototype.removePizza = function(pizzaNumber) {
  this.pizzas.splice(pizzaNumber - 1, 1);
}

Order.prototype.determineTotalCost = function() {
  var totalCost = 0;
  this.pizzas.forEach(function(pizza) {
    totalCost += pizza.cost;
  });
  this.totalCost = totalCost;
}




// =========================================== //
//                 Front End                   //
// =========================================== //

var toggle = function(toHide, toShow) {
  $(toHide).hide();
  $(toShow).show();
}

var createCustomerOrder = function() {
  var customerName = $('#name').val();
  var customerAddress = $('#street').val() + ', ' + $('#city').val() + ', ' + $('#zip-code').val();
  var customerPhone = $('#phone').val();

  return new Order(customerName, customerAddress, customerPhone);
}

var createPizza = function() {
  var pizzaSize = $('input[name="pizza-size"]:checked').val();
  var cheese = $('input[name="cheese-options"]:checked').val();
  var appetizers = $('input[name="appetizer-options"]:checked').val();
  var newPizza = new Pizza(pizzaSize, cheese, appetizers);
  $('input[name="meat-toppings"]:checked').each(function() {
    newPizza.addToppingMeat($(this).val());
  });
  var vegToppings = [];
  $('input[name="veg-toppings"]:checked').each(function() {
    newPizza.addToppingVeggie($(this).val());
  });
  var gourmetToppings = [];
  $('input[name="gourmet-toppings"]:checked').each(function() {
    newPizza.addToppingGourmet($(this).val());
  });


  resetForm();
  return newPizza;
}

var resetForm = function() {
  $('input[name="pizza-size"]:checked').attr("checked", false);
  $('input[value="medium"]').prop("checked", true);
  $('input[name="cheese-options"]:checked').attr("checked", false);
  $('input[name="appetizer-options"]:checked').attr("checked", false);
  $('input[value="regular"]').prop("checked", true);
  $('input[name="meat-toppings"]:checked').attr("checked", false);
  $('input[name="veg-toppings"]:checked').attr("checked", false);
  $('input[name="gourmet-toppings"]:checked').attr("checked", false);
}

var populateList = function(pizza) {
  $('.pizza-list').append('<div class="pizza">' +
    '<h4><span class="pizza-list-size">' + name + ' Order</span></h4>' +
    '<div class="pizza-info-toggle">' +
    '<p>Cheese: <span class="pizza-list-cheese">' + pizza.cheese + '</span></p>' +
    '<p>Toppings: </p>' +
    '<ul class="pizza-list-meat-toppings"></ul>' +
    '<ul class="pizza-list-veg-toppings"></ul>' +
    '<p>Gourmet Toppings: </p>' +
    '<ul class="pizza-list-gourmet-toppings"></ul>' +
    '<p>Appetizers: </p>' +
    '<ul class="pizza-list-appetizer-options"> <li>' + pizza.appetizer + '</li></ul>' +
    '<p>Cost of this pizza: $ <span>' + pizza.cost.toFixed(2) + '</span></p>' +
    '</div>' +
    '</div>');
  pizza.meatToppings.forEach(function(meatTopping) {
    $('.pizza-list .pizza-list-meat-toppings').last().append('<li>' + meatTopping + '</li>');
  });
  pizza.vegToppings.forEach(function(vegTopping) {
    $('.pizza-list .pizza-list-veg-toppings').last().append('<li>' + vegTopping + '</li>');
  });
  pizza.gourmetToppings.forEach(function(gourmetTopping) {
    $('.pizza-list .pizza-list-gourmet-toppings').last().append('<li>' + gourmetTopping + '</li>');
  });
  $('.pizza').last().click(function() {
    $(this).find('.pizza-info-toggle').toggle();
  });
  $('.pizza-info-toggle').last().click(function() {
    $(this).find('.pizza-info-toggle').toggle();
  });
}

var populateTotalPrice = function(customerOrder) {
  customerOrder.determineTotalCost();
  return customerOrder.totalCost;
}

$(document).ready(function() {
  var customerOrder = new Order();

  $('.launch-order button').click(function() {
    toggle('.launch-order', '.order-information-input');
  });

  $('.order-information-input form').submit(function(event) {
    event.preventDefault();
    customerOrder = createCustomerOrder();
    toggle('.order-information-input', '.order-pizza-input');
  });

  $('.order-pizza-input form').submit(function(event) {
    event.preventDefault();
    var thisPizza = createPizza();
    customerOrder.addPizza(thisPizza);
    populateList(thisPizza);
    $("#pizza-list-total-cost").text('$ ' + populateTotalPrice(customerOrder).toFixed(2));
    toggle('.order-pizza-input', '.summary');
    console.log(customerOrder);
  });

  $('#add-pizza').click(function() {
    name = prompt("Enter a name")
    toggle('.summary', '.order-pizza-input');
  });

  $('#confirm-order').click(function() {
    toggle('.summary', '.checked-out');
  });

  // reset
  $('#refresh').click(function() {
    customerOrder = new Order();
    $('.pizza-list').empty();
    toggle('.checked-out', '.launch-order');
  });
});
