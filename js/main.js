$(document).ready(function() {
	
	var Game = {
		round: 18,
		count: 0,
		level: 1,
		strict: false,
		gameSequence: [],
		playerSequence: [],
		active: false,
		playerMove: false,
		buttons: ["green", "red", "yellow", "blue"],
		sounds:  {"green": "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
				  "red": "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
				  "yellow": "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
				  "blue": "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"},


		init: function(){
			
			this.active = true;
			this.gameSequence = [];
			this.playerSequence = [];
			this.generateSequence();
			

		},

		

		displaySequence: function(sequence) {
			
			var index = 0;

			blink(sequence[index]);
			function blink(color) {
				setTimeout(function() {
					Game.playSound(color);
					$('.'+color).toggleClass('buttonFlash');
					setTimeout(function() {
						$('.'+color).toggleClass('buttonFlash');
						if(index < sequence.length) {
							index++;
							blink(sequence[index]);
						}
						else {
							
							Game.playerMove = true;
						}
					}, 500);
				}, 50);
			}
			
			
			console.log(this.gameSequence);
			
			
		},
		allBlink: function(elem, times, speed) {
			var r = $.Deferred();
			
			blink();
			function blink() {
				setTimeout(function() {
					$(elem).toggleClass('buttonFlash');
					setTimeout(function() {
						$(elem).toggleClass('buttonFlash');
						if (times > 0) {
							times--;
							blink();
						}
						else {
							 
							 r.resolve();	
							 
							
						}
					}, speed)
				}, speed);
			}

			return r;	
			
		},

		
		check: function(click) {
			// console.log(click);
			
			// 
			if (click[this.count] !== this.gameSequence[this.count]){
				
				
					this.wrongMove();
					this.count = 0;
					this.playerSequence = [];
				
				

			}
			
			else {
				// console.log("add count. The count is: " + this.count);
				this.count++;
				// console.log("the new count is: " + this.count);

			}
			if (this.count === this.gameSequence.length) {
				
				this.active = false;
				this.count = 0;
				setTimeout(function() {
					Game.generateSequence();
				},1000);
				this.playerSequence=[];
			}
		},

		wrongMove: function() {
			
			
			// if($('.btn').hasClass('buttonFlash')) {
			// 	$('.btn').removeClass('buttonFlash');
			// }
			if (this.strict == true) {
				this.allBlink('.btn', 4, 400).done(function() {
					Game.restart();
				});
				this.playerMove = false;

			} else
			{
				this.allBlink('.btn', 4, 400).done(function() {
					Game.displaySequence(Game.gameSequence);
				});
				this.playerMove = false;
			}
			
			
			
			
			

		},
		
		
		
		buttonBlink: function(color) {
			setTimeout(function() {
				Game.playSound(color);
				$('.'+color).toggleClass('buttonFlash');
				setTimeout(function() {
					$('.'+color).toggleClass('buttonFlash');
				}, 500);
			}, 50);
		},

		generateSequence: function() {
			
			
			this.gameSequence.push(this.buttons[Math.floor(Math.random() * 4)]);
			this.active = true;
			this.round++;
			if (this.round > 20) {
				this.gameWon();
			}
			else {
				this.displaySequence(this.gameSequence);
				
				$(".round").text(this.round);
			}

			
		},

		playSound: function(clip) {
			
			var sound = new Audio(this.sounds[clip]);
			
			sound.play();
		},

		restart: function() {
			console.log('restart');
			this.gameSequence = [];
			this.playerSequence = [];
			this.level = 1;
			this.round = 0;
			this.count = 0;
			
			this.active = true;
			this.init();

		},

		gameWon: function() {
			console.log($('#counterText').text());
			this.playerMove = false;
			$('#win').show();
			winFlash();
			rapidFlash();
			var times = 4;
			function winFlash() {
				
				setTimeout(function() {
					$('.round').hide();
					setTimeout(function() {
						$('.round').show();
						if (times > 0) {
							times--;
							winFlash();
						}
						
					}, 400)
				}, 400);
			}

			function rapidFlash() {
				var colors = ['green', 'red', 'yellow', 'blue'];
				
				for (i = 10; i > 0; i--) {
					for (j = 0; j < colors.length; j++) {
						Game.allBlink("." + colors[j], 1, 2000);
					}
				}
				
			}
		}

		


	};
    
    
	$('#startBtn').on("click", function() {
		if (Game.active) {
			Game.restart();
			$("#win").hide();
		}
		else {
			Game.init();
			
		}
        
		
	});

	$('.btn').on("click", function(e) {
		if (!Game.active || !Game.playerMove) {
			return false;
		} else {
			var click = this.classList[1];
			
			if (Game.playerMove) {
				
				Game.buttonBlink(click);
				
				Game.playerSequence.push(click);

				Game.check(Game.playerSequence);
			}
			else {
				return false;
			}

		}
		
		
	});

	$('#strictBtn').on("click", function(e) {
		var btn = $('#strictBtn');
		
		if (btn.hasClass("buttonFlash")) {
			btn.removeClass("buttonFlash");
			Game.strict = false;
		} else {
			btn.addClass("buttonFlash");
			Game.strict = true;
		}

	});

});