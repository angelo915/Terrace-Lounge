if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
}

else ready();

function ready() {
    let a = document.querySelectorAll('.btn-danger');
    for (let i = 0; i < a.length; i++) {
       let button = a[i];
       button.addEventListener('click', removeCartItem)}

let quantityInputs = document.querySelectorAll('.cart-quantity-input');
for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i]
  input.addEventListener('change',quantityChanged);

} 
let addToCartButtons = document.querySelectorAll('.btn-primaryyy');
   for (let i = 0; i < addToCartButtons.length; i++) {
       let button  = addToCartButtons[i];
       button.addEventListener('click', addToCartClicked);
   }

   
   function addToCartClicked(event) {
    let button =  event.target;
    let shopItem = button.parentElement.parentElement;
    let title = shopItem.querySelectorAll('h4')[0].innerText;
    let price = shopItem.querySelectorAll('.food-priceee')[0].innerText;
    let imageSrc = shopItem.querySelectorAll('.img-responsiveee')[0].src;
console.log(title,price,imageSrc)
   addItemToCart(title,price,imageSrc);
   updateCartTotal();
 }

 function addItemToCart(title,price,imageSrc) {
    let cartRow = document.createElement('div');
    cartRow.classList.add('cart-row')
    let cartItems = document.querySelectorAll('.cart-items')[0]
    let cartItemNames = document.querySelectorAll('.cart-item-title');
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item already added to cart')
            return
        }

    }
   let cartRowContents = `
   <div class="cart-item cart-column">
   <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
   <span class="cart-item-title">${title}</span>
</div>
<span class="cart-price cart-column">${price}</span>
<div class="cart-quantity cart-column">
   <input class="cart-quantity-input" type="number" value="1">
   <button class="btn btn-danger" type="button">REMOVE</button>
</div>
   `
   cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.querySelectorAll('.btn-danger')[0].addEventListener('click',removeCartItem);
    cartRow.querySelectorAll('.btn-danger')[0].addEventListener('click',changeName);
    cartRow.querySelectorAll('.cart-quantity')[0].addEventListener('change',quantityChanged);
}


function changeName(e) {
    let conatiner = e.target;
       let y = conatiner.parentElement.parentElement;
       let z = y.querySelector('.cart-item-title').innerHTML;
       let addToCartButtons = document.querySelectorAll('.btn-primaryyy');
       let arr = [];
   for (let i = 0; i < addToCartButtons.length; i++) {
       let container = addToCartButtons[i].parentElement.parentElement;
       let specificButton = container.querySelectorAll('.btn-primaryyy')[0];
       arr.push(specificButton);
       let specificElement = container.querySelectorAll('h4')[0].innerHTML;
       if (specificElement == z) {
           arr[i].innerHTML = 'Add To Cart'
       }
   }
}

function removeCartItem(event) {
    let btn_clicked = event.target;
    btn_clicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function purchaseClicked() {
    alert('Thank You for purchasing ur meal will be there soon');
    let cartItems = document.querySelectorAll('.cart-items')[0];
    let totalPrice = document.getElementsByClassName('cart-total-price')[0];
    let addToCartButtons = document.querySelectorAll('.btn-primaryyy');
    cartItems.innerHTML = '';
    for (let items in addToCartButtons) addToCartButtons[items].innerHTML = 'Add To Cart'
 
totalPrice.innerText = `${0} ETB`;
}
function quantityChanged(event) {
     let input = event.target;
     if (isNaN(input.value) || input.value < 0 || input.value == 'null') {
         input.value = 1;
     }
     if (input.value == 0) {
        document.querySelectorAll('.cart-items')[0].innerHTML = '';
     }
     updateCartTotal();
}
function updateCartTotal() {
let cartContainer = document.getElementsByClassName('cart-items')[0];
let cartRows = cartContainer.getElementsByClassName('cart-row');
let total = 0;
  for (let i = 0; i < cartRows.length; i++) {
      let cartRow = cartRows[i];
     let priceElement = cartRow.getElementsByClassName('cart-price')[0];
     let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
     let price = parseFloat(priceElement.innerText.replace('$', ''));
     let quantity = parseFloat(quantityElement.value);
     total += price * quantity;
  }
  total = Math.round(total * 100) / 100
  document.getElementsByClassName('cart-total-price')[0].innerText = `${total} ETB`;
}
  document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);
}
