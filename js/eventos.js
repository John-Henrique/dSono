/**
controla os eventos online, offline, backbutton
é necessário instalar o plugin 
	CORDOVA-PLUGIN-DIALOGS
	
	Auto start app
	https://github.com/ToniKorin/cordova-plugin-autostart
*/
$(function(){
	
	document.addEventListener( 'deviceready', app_init, false );
		

	function app_init(){
		//navigator.notification.alert( 'app iniciado', false, "Aviso", 'Ok' );
		
		
		document.addEventListener( 'online', 		app_online, false );
		document.addEventListener( 'offline', 		app_offline, false );
		document.addEventListener( 'backbutton', 	app_backbutton, false );
		document.addEventListener( 'pause', 		app_pause, false );
		document.addEventListener( 'resume', 		app_resume, false );
	}


	function app_offline(){
		//phonon.alert( 'conexão não disponivel "offline"', "Falha de conexão", false, 'Ok' );
	}
	
	function app_online(){
		//phonon.notif( "uhuuu, a internet voltou!", 4000, false );
	}
	
	function app_backbutton(){
		
		if( phonon.navigator().currentPage == 'principal' ){
			exitAppPopup();
		}else{
			history.back();
		}
	}
	
	function app_pause(){
		//navigator.notification.alert( 'app pausado "pause"', false, "Aviso", 'Ok' );
	}
	
	function app_resume(){
		//phonon.notif( "Bem vindo de volta", 4000, true, "Fechar" );
	}
	
	
	
	
	
	
	function exitAppPopup() {
		navigator.notification.confirm(
			'Sair do app?'
				, function(button){
					if(button == 2){
						navigator.app.exitApp();
					}else if( button == 3 ){
						location.replace( config.app_id() );
					}else{
						
					}
				}
				, 'Sair'
				, ['Não','Sim','Avaliar']
			);  
		return false;
	}
});