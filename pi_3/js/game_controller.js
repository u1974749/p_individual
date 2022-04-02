const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];

var options_data = {
	cards:2, dificulty:"hard"
};

var load = function(){
	var json = localStorage.getItem("config","{'cards':2,'dificulty':'hard'}");
	if(json)
	{
		options_data = JSON.parse(json);
	}
};
ob=this;
load();

function flip(){
	for (var i = 0; i < this.items.length; i++){
		Vue.set(ob.current_card, i, {done: false, texture: this.items[i]}); //falta lo del this
	}
}
//	Vue.set(this.current_card, i, {done: false, texture: back}); //falta lo del this


var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		level: "normal"
	},

	created: function(){
		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.num_cards = options_data.cards;
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]}); //this.items[i]
		}
		//var r = this.flip;
		this.level = options_data.dificulty;
		if(this.level == "easy")
		{
			setTimeout(flip, 100);
		}
		else if(this.level == "normal")
		{
			setTimeout(flip, 100);
		}
		else if(this.level == "hard")
		{
			setTimeout(this.flip, 100);
		}
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if (true) return; //value.texture === back
			var front = null;
			var i_front = -1;
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done && this.current_card[i].texture !== back){
					if (front){
						if (front.texture === this.current_card[i].texture){
							front.done = this.current_card[i].done = true;
							this.num_cards--;
						}
						else{
							Vue.set(this.current_card, i, {done: false, texture: back});
							Vue.set(this.current_card, i_front, {done: false, texture: back});
							this.bad_clicks++;
							break;
						}
					}
					else{
						front = this.current_card[i];
						i_front = i;
					}
				}
			}			
		},
	},
	computed: {
		score_text: function(){
			if(this.level == "easy")
			{
				return 100 - this.bad_clicks * 5;
			}
			else if(this.level == "normal")
			{
				return 100 - this.bad_clicks * 10;
			}
			else if(this.level == "hard")
			{
				return 100 - this.bad_clicks * 20;
			}
		}
	}
});





