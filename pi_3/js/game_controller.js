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

load();

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		level: "normal", // indica el nivel del juego
		start: true //indica si se ha terminado de mostrar las cartas
	},
	/*flip: function(){
		for (var i = 0; i < this.items.length; i++){
			//Vue.set(this.current_card, i, {done: false, texture: this.items[i]}); //gira las cartas para ponerlas boca abajo
			this.current_card.set({done: false, texture: back});
		}
	},*/
	created: function(){
		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.num_cards = options_data.cards; // el numero de cartas es igual al que elije el usuario
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			//this.current_card.push({done: false, texture: back}); 

			//ESTA SERIA LA LINEA DE CODIGO CORRECTA PERO NO FUNCIONA EL FLIP
			//POR LO QUE LO HE COMENTADO Y HE DEJADO LA LINEA ANTIGUA
			//PARA PODER PROBAR EL RESTO DEL CODIGO
			this.current_card.push({done: false, texture: this.items[i]}); //muestra las cartas de frente
		}
	
		this.level = options_data.dificulty; //iguala la dificultad a la elegida por el usuario
		//Dependiendo del nivel mostrara las cartas mas o menos rapido
		var showtime = 100;
		if(this.level == "easy")
		{
			showtime = 5000;
		}
		else if(this.level == "normal")
		{
			showtime = 2500;
		}
		else if(this.level == "hard")
		{
			showtime = 100;
		}
		
		setTimeout (()=>{
			for (var i = 0; i < this.items.length; i++){
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]}); //gira las cartas para ponerlas boca abajo
			}
			this.start = false;
		}, showtime)
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if (value.texture === back || this.start) return; //el start permite salir del bucle cuando se colocan todas las cartas del derecho
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
			//dependiendo del nivel baja mas o menos los puntos
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





