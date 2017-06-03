/*jslint browser: true*/
/*global console, Welcomescreen, $*/

// Init method

$(document).ready(function () {
  
  var options = {
	'closeButtonText': "Pular",
    'bgcolor': '#0da6ec',
    'fontcolor': '#fff',
    'onOpened': function (){
    },
    'onClosed': function (){
    }
  },
    welcomescreen_slides,
    welcomescreen;

  welcomescreen_slides = [
    {
      id: 'slide0',
      picture: '<div class="tutorialicon">(ᵔᴥᵔ)</div>',
      text: 'A que horas se deitou? <input type="text" data-time-format="H:i" class="sobre-1 hora" />'
    },
    {
      id: 'slide1',
      picture: '<div class="tutorialicon">ಠ╭╮ಠ</div>',
      text: 'Seu horário de aula mudou? Sem problema, altere sua agenda de aulas. <BR><BR><BR>Veja <a href="#!disciplinas">Aulas</a>'
    },
    {
      id: 'slide2',
      picture: '<div class="tutorialicon">♫</div>',
      text: 'Notificações serão emitidas para te lembrar do horário das aulas. <BR><BR><BR>Veja <a href="#!notificacoes">Notificações</a>'
    },
    {
      id: 'slide3',
      picture: '<div class="tutorialicon">♥‿♥</div>',
      text: 'Obrigado por usar o app! Envie duvidas e sugestões através do <a href="#!contato">contato</a>'
    }

  ];





	document.on('pageopened', function(event) {
		
		tela = event.detail.page;
		
		if( tela == 'principal' ){
			//welcomescreen = new Welcomescreen(welcomescreen_slides, options);
		}
	})



  $(document).on('click', '.tutorial-close-btn', function () {
    welcomescreen.close();
  });

  $( document ).on( 'click', '.tutorial-open-btn', function () {
    welcomescreen.open();  
  });

  $(document).on('click', '.tutorial-next-link', function (e) {
    welcomescreen.next(); 
  });

  $(document).on('click', '.tutorial-previous-slide', function (e) {
    welcomescreen.previous(); 
  });
  
});