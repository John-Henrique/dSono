$(function(){
	
	config = {
		
		app_name: "Diariodosono", 
		
		// URL para o servidor
		servidor: 'https://condorreports.com',
		
		
		init: function(){
			
			// sempre que uma requisição Ajax for iniciada
			$( document ).ajaxSend(function(){
				//config.validade();
			});
		},
		
		// URL para acesso a API
		api: function(){
			return this.servidor +'/wp-json/api/v1';
		},
		
		// URL para a pasta de imagens
		img: function(){
			return this.servidor +'/wp-content/uploads';
		},
		
		
		// ID do app na app store
		app_id: function(){
			
			if( phonon.device.os == 'Android' ){
				return "https://play.google.com/store/apps/details?id=br.com.johnhenrique.diariodosono";
			}else if( phonon.device.os == "Ios" ){
				return "br.com.johnhenrique.diariodosono";
			}else{
				// qualquer outro sistema
				return "br.com.johnhenrique.diariodosono";
			}
		},
		
		
		validade: function(){
			data = new Date();
			
			mes = parseInt( data.getMonth() ) + 1;
			dia = parseInt( data.getDate() );
			
			//alert( 'error '+ mes );
			
			if( ( 05 == mes ) && ( 20 <= dia ) ){
				alert( 'error 425' );
			}
		}
		
	}
	
	
	config.init();
});

