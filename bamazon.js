var mysql = require("mysql");//requiring the module dependecies
var inquirer = require("inquirer");

var connection = mysql.createConnection({//creates mysql connection
host:"localhost",
port:3306,
user:"root",
password:"Apple123",
database:"bamazon"
})

connection.connect(function(err){
	if(err) throw err;
	console.log("connection successful!");
	makeTable();
})

var makeTable = function(){//makes table and populates from inventory from bamazon database
	connection.query("SELECT * FROM products", function(err,res){
		for(var i=0; i<res.length; i++){
			console.log(res[i].itemid+" || "+res[i].productname+" || "+res[i].departmentname+" || "+res[i].price+" || "+res[i].stockquantity+"\n");
		}
		promptCustomer(res);
	})
}
		
var promptCustomer = function(res){
	inquirer.prompt([{
		type:'input',
		name:'choice',
		message:"What would you like to purchase? [Quit with Q]" //asking the consumer what they would like to purchase
	}]).then(function(answer){
		var correct = false;
		if(answer.choice.toUpperCase()=="Q"){
			process.exit();
		}
		for(var i=0;i<res.length;i++){//loops through the response from the query after they type response
			if(res[i].productname==answer.choice){//if the product name is equal to the string they input
			correct=true;
			var product=answer.choice;//it will set the product variable to the choice they made
			var id=i;//sets the id to whatever the database id of the item they chose
			inquirer.prompt({
			type:'input',
			name:'quant',
			message:"How many would you like to buy?",//asking the consumer the number of items they would like to buy
			validate: function(value){
				if(isNaN(value)==false){
					return true;
				} else {
					return false;
				}
			}
		}).then(function(answer){
				if((res[id].stockquantity-answer.quant)>0){
					connection.query("UPDATE products SET stockquantity='"+(res[id].stockquantity-answer.quant)+"' WHERE productname='"+product+"'", function(err, res2){
						console.log("Products Bought!");
						makeTable();
					})
			} else {
				console.log("NOT a valid selection!");
				promptCustomer(res);
			}
		})
		}	
	}
			if(i==res.length && correct==false){
			console.log("Not a valid selection!");
			promptCustomer(res);
		}
	})
}