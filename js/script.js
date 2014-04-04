$(document).ready(function() {

	// LA FONCTION QUI EMET LA HAUTER DE LA DIV CONTENT PRINCIPALE A LA BONNE TAILLE
	setInterval(hauteurdediv, 50);
	function hauteurdediv(){
		var hauteur = $('#content').height();
		$('#content-large').height(hauteur - 114);
	};

	// LA FONCTION QUI PERMET DE FAIT SCROLLER LA SIDEBAR
	$(window).scroll(function(){
		var valeurscroll = $(window).scrollTop();
		var positionsidebar = 287-20;
		if (valeurscroll > positionsidebar) {
			var topsidebar = valeurscroll - positionsidebar;
			$('#sidebarbets').stop().animate({
				top : topsidebar,
			},300);
		}
		else if(valeurscroll < positionsidebar) {
			var topsidebar = valeurscroll - positionsidebar;
			$('#sidebarbets').stop().animate({
				top : '0',
			},300);
		};
	});


	// FILTRE DES LEAGUE SUR LA PAGE PRINCIPALE
	$('#filter .league').click(function(){
		var $self = $(this);
		if($self.hasClass("selected")){
			$self.removeClass("selected").addClass("unselected");
		}
		else{
			$self.removeClass("unselected").addClass("selected");
		}
		var nombreselection = $('#filter #leagues .league.selected').length;
		console.log(nombreselection);
		if(nombreselection > 0){
			$('#filter #leagues .league.unselected').each(function(){
				var $self = $(this);
				var couleur = $self.css("borderBottomColor");
				$('.cartouche-medium').each(function(){
					var $self1 = $(this);
					var couleurcartouche = $self1.find('.match-infos').css("borderBottomColor");
					if (couleur == couleurcartouche) {
						$self1.slideUp(500);
					};
				});
			});
			$('#filter #leagues .league.selected').each(function(){
				var $self = $(this);
				var couleur = $self.css("borderBottomColor");
				console.log(couleur);
				$('.cartouche-medium').each(function(){
					var $self1 = $(this);
					var couleurcartouche = $self1.find('.match-infos').css("borderBottomColor");
					if (couleur == couleurcartouche) {
						$self1.slideDown(500);
					};
				});
			});
		}
		else{
			$('.cartouche-medium').slideDown(500);
		};
		hauteurdediv();
	});

	// CACHE LE CARRE AVEC LE NOMBRE DE PARIS SI IL N'Y EN A PAS
	function betnumber(){
		var betnumber = $('#bet-number-sidebar').html();
		if(betnumber<=0){
			$('#sidebar-matchandbet-container').html("<div style='padding:10px 0;text-align:center;'>You don't have any bet yet</div>");
			$('#container-button-sidebar').hide();
			$('#bet-number-sidebar-container').hide();
		}
		else{
			$('#container-button-sidebar').slideDown(200);
			$('#bet-number-sidebar').html(betnumber);
			$('#bet-number-sidebar-container').animate({
				width:"show",
			},500);
		};
	};

	// INITIALISATION ET FONCTION DES DROPDOWN
	$('.dropdown').hide();
	$('#header-menu li').hover(function(){
		$(this).children('.dropdown').fadeToggle(50);
	});

	// FONCTION ACTIVE AU MOMENT D'UN CLIC SUR UN BOUTON DE PARIS (A TRAVAILLER POUR AJAX)
	$('.bet-button').click(function(){
		var $self = $(this);
		if($self.hasClass("clickable")){
			$self.removeClass("clickable");
			var $parent;
			var $image;
			var $bettype = $self.parents(".bets-undertitle");
			var $leftorright = $self.parents(".bet-side");
			if($('body').hasClass("matchlist")){
				$parent = $self.parents(".team-container>div>div");
				$image = $parent.children(".transfer-image");
			}
			else if($('body').hasClass("matchsheet")){
				if ($bettype.hasClass("bets-leftright")) {
					if ($leftorright.hasClass("bets-left")) {
						$image = $("#team-left .team-image");
					}
					else if ($leftorright.hasClass("bets-right")) {
						$image = $("#team-right .team-image");
					};
				}
				else if($bettype.hasClass("bets-center")){
					$image = $self.parents(".bet-solo");
				};
			};
			$image.effect( "transfer", {to: "#sidebar-matchandbet-container"}, 700 ,function(){
				// FONCTION AJAX QUI APPELLE LE MATCH ET LE BET A METTRE ICI
				refreshresultsidebar();
			});
			$('.ui-effects-transfer').css({
				"border": "none",
				"background" : "none"
			});
			var imagesrc = $image.attr('src');
			if(imagesrc != undefined){
				var imagesrc = $image.attr('src');
				$('.ui-effects-transfer').css("background" , "url(" + imagesrc + ") no-repeat center center");
			}
			else{
				$('.ui-effects-transfer').css('border','1px dotted #DDD');
			};
		};
	});

	//FONCTION ET INITIALISATION DU RAFRAISSISEMENT DES RESULTATS DANS LA SIDEBAR
	refreshresultsidebar();
	function refreshresultsidebar(){
		setTimeout(function(){
			var totalbet = 0;
			var possiblegain = 0;
			var combinercote = 1;
			var nombredebetchecked = 0;
			var nombredebet = 0;
			$('#sidebarbets .sidebar-bet .bet-input').each(function(){
				var $self = $(this);
				var valeur = $self.val();
				valeur = parseFloat(valeur);
				var cote = $self.parents('.sidebar-bet').find('.bet-cote').html();
				cote = parseFloat(cote);
				var $checkbox = $self.parents('.sidebar-bet').find('.bet-checkbox');
				var checked = $checkbox.prop('checked');
				if(cote && (checked == true)){
					combinercote = combinercote * cote;
					nombredebetchecked += 1;
				};
				if(valeur){
					if(cote){
						possiblegain += valeur*cote;
					};
					$self.parents('#sidebar-combined').find()
					totalbet += valeur;
				};
				nombredebet +=1;
			});
			$('#sidebarbets #sidebar-combined .bet-input').each(function(){
				var $self = $(this);
				var valeur = $self.val();
				valeur = parseFloat(valeur);
				if(valeur && (nombredebetchecked >=2)){
					possiblegain += combinercote * valeur;
					totalbet += valeur;
				};
			});
			// ARRONDIS AU DIXIEME
			totalbet *= 100;
			totalbet = parseInt(totalbet);
			totalbet /= 100;
			possiblegain *= 100;
			possiblegain = parseInt(possiblegain);
			possiblegain /= 100;
			// AFFICHAGE DES RESULTATS
			$('#totalbet').html(totalbet);
			$('#possiblegain').html(possiblegain);

			// ON EFFACE LES LIGNE COMBINE ET RESULTAT SI IL N'Y A PLUS DE PARIS...
			if( nombredebetchecked <= 1){
				$('#sidebar-combined').hide();
			}
			else{
				$('#sidebar-combined').slideDown(200);
			};
			if( totalbet == 0 && possiblegain == 0){
				$('#sidebar-total').hide();
			}
			else{
				$('#sidebar-total').slideDown(200);
			};

			$('#bet-number-sidebar').html(nombredebet); // RAFRAICHI LE NOMBRE DE MATCH
			betnumber();
		},100);
	};

	// RAFRAICHI LA SIDEBAR SI ON TAPE QQCH DEDANS
	$('#sidebarbets .bet-input').keydown(function(){
		refreshresultsidebar();
	});
	$('#sidebarbets .bet-checkbox').click(function(){
		refreshresultsidebar();
	});
	
	// QUAND ON SUPPRIME UN BET (A VOIR AVEC CELLE QUI EST DANS refreshresultsidebar)
	$('#sidebarbets .sidebar-bet .croix').click(function(){
		var $self = $(this);
		var $containermatch = $self.parents('.sidebar-matchandbet');
		var nombrebets = $self.parents('.sidebar-bets').find('.sidebar-bet').length;
		$self.parents('.sidebar-bet').slideUp(200,function(){
			$self.parents('.sidebar-bet').remove('.sidebar-bet');
			refreshresultsidebar();
		});
		if(nombrebets <= 1){
			$containermatch.slideUp(200,function(){
				$containermatch.remove();
			});
		};
	});

	// FONCTION DE TIMER INVERSE (A VOIR POUR REMPLACEMENT PHP)
	setInterval(seconde, 1000);
	function seconde(){
		var valeur = $('.seconde').html();
		valeur -= 1;
		if (valeur < 0){
			valeur = 59;
			$('.minute').each(function(){
				var $self = $(this);
				var minute = $self.html();
				minute -= 1;
				var $horaire = $self.parent(".horaire-timer");
				var $divheure = $horaire.children(".heure");
				var $spanh = $horaire.children("span:contains('h')")
				var heure = $divheure.html();
				if (minute < 0 && heure > 0){
					minute = 59;
					heure -= 1;
					if(heure < 1){
						$divheure.hide();
						$spanh.remove();
					}
					else{
						var longueurheure = (heure+"").length;
						$divheure.html(heure);
						if(longueurheure == 1){
							heure = "0"+ heure;
						};
					};
					$divheure.html(heure);
				}
				// FONCTION QUI ENLEVE LES BOUTONS ET QUI AFFICHE "NOW LIVE"
				else if(minute < 0 && heure <= 0){
					$horaire.html("now live !").css("color","#28b621").css("fontWeight","400");
					$horaire.parents('.match-cartouche-general').find('.bet-button').hide(500);
				};
				var longueurmin = (minute+"").length;
				if(longueurmin == 1){
					minute = "0"+ minute;
					$self.html(minute);
				};
				$self.html(minute);
			});
		};
		var longueursec = (valeur+"").length;
		if(longueursec == 1){
			valeur = "0"+ valeur;
			$('.seconde').html(valeur);
		};
		$('.seconde').html(valeur);
		return false;
	};


	$('.heure').each(function(){
		var $self = $(this);
		var heure = $self.html();
		if(heure <= 0){
			$self.hide();
			$self.parent(".horaire-timer").children("span:contains('h')").hide();
		};
	});
});