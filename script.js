//~ CopyLeft 2020 Michael Rouves

	//~ This file is part of Michael's Clicker.
	//~ Michael's Clicker is free software: you can redistribute it and/or modify
	//~ it under the terms of the GNU Affero General Public License as published by
	//~ the Free Software Foundation, either version 3 of the License, or
	//~ (at your option) any later version.

	//~ Michael's Clicker is distributed in the hope that it will be useful,
	//~ but WITHOUT ANY WARRANTY; without even the implied warranty of
	//~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	//~ GNU Affero General Public License for more details.

	//~ You should have received a copy of the GNU Affero General Public License
	//~ along with Michael's Clicker. If not, see <https://www.gnu.org/licenses/>.
//



//       									 ============= GLOBAL VARIABLES =============

var money = 0,//global player's money
	clickGain = 1,//money gain on clicker clicked =
	autoGain = 1,//auto money gain
	interval;//auto money interval

// HTML MAIN ELEMENTS (except  shop buttons)
var element = {
	clicker   : document.getElementById("main-clicker"),//button
	money     : document.getElementById("money"),//txt
}

//       									============= GLOBAL FUNCTIONS =============

function addMoney() { // onClicker pressed add ClickGain
  money = money + clickGain;
}
function updateMoney(check=true) {//update html money txt
  text = "$" + money;
  element.money.innerHTML = text;
  if(check){checkPrices();}
}
function autoMoney(amount) {//auto add money every interval
  clearInterval(interval);
  interval = setInterval(function(){ money = money + autoGain; updateMoney(); }, 200 / amount);
}

//called when a shop Element was bought
function checkPrices() {
	//Check price for each shop element
	//unlock purchase button if enough money
	for(let i=0;i<shop.length;i++){
		if(money >= shop[i].price){
			shop[i].element.disabled = false;
		}
	}
}
//called when a shop Element was bought
function onBuy(obj) {
	//update money
	money -= obj.price;
	updateMoney(check=false);
	//lock every purchase buttons in shop
	for(let i=0;i<shop.length;i++){
		shop[i].element.disabled = true;
	}
}

//       								 ============= SHOP BUTTON CLASS =============

class ShopElement{
	// Object for elements in the shop.
	// New Instance Token:
	//	 id -> html main element id (in Html)
	//   newprice_func -> the new price formula function
	//   onclick_func  -> the onClick function
	
	constructor (id,newprice_func,onclick_func) 
	{ //constructor: called on "new ShopElement()"
		this.id = id;
		this.element = document.getElementById(id);
		this.element.onclick = this.purchase.bind(this);
		this.text_element = this.element.getElementsByTagName("b")[0];
		
		this._updatePrice = newprice_func;
		this._onClick = onclick_func;
		
		this.price = 0;
		this.purchaseLvl = 1;
		this.updatePrice();
	}
	
	//Call default functions with this as argument
	onClick(){this._onClick(this);}
	updatePrice(){this._updatePrice(this);}
	
	//Update Button's txt price
	updateText(){
		this.text_element.innerHTML = "<b>" +'$'+this.price+': ' + "</b>";}
	
	// Update Every new purchase
	update(){
		this.updatePrice(); //calculate new price
		this.updateText();  //update displayed txt
	}
	// called on Element clicked
	purchase(){
		this.purchaseLvl += 1;
		this.onClick();
		onBuy(this);
		this.update()
		checkPrices();
	}
	
}

//       							 =============== SHOP BUTTONS & FUNCTIONS ===============

//alls buttons functions ( newPriceFormula , onClick )
function newPrice1(obj){obj.price = clickGain * 25 * obj.purchaseLvl;}
function newPrice2(obj){obj.price = 200 * obj.purchaseLvl;}
function newPrice3(obj){obj.price = autoGain * 30 * obj.purchaseLvl + 500;}
function onClick1(obj){clickGain*=2;}
function onClick2(obj){autoMoney(this.purchaseLvl);}
function onClick3(obj){autoGain*=2;}



//all shop's buttons
shop = [
	new ShopElement("b1",newPrice1,onClick1),
	new ShopElement("b2",newPrice2,onClick2),
	new ShopElement("b3",newPrice3,onClick3),
];

//       									 ================= START =================

// FIRST UPDATE (on page loaded)
updateMoney(); //money txt
for (let i=0;i<shop.length;i++){
	shop[i].update() //buttons txt & price
}

//set main clicker function onClick
element.clicker.onclick = function() { 
	element.clicker.disabled = true;
	addMoney(); updateMoney(); 
	element.clicker.disabled = false;
};


