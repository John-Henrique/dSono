$(function(){

	configuracoes = {
		
		
		init:function(){
			
			$( 'configuracoes .btn-salvar' ).click(function(){
				
				configuracoes.respostas();
			});
			
			
			$( '.idioma' ).click( function(){
				console.log( "idioma clicado");
				configuracoes.idioma( this );
			});
			
		},
		
		
		idioma: function( ele ){
			
			var lang = $( ele ).data( 'l' );
			if(lang) {
				phonon.updateLocale(lang);
				console.log( "change language to "+ lang );
			}else{
				console.log( "language not change");
			}
		},
		
		
		
		respostas: function(){
			hora = '';
			radio = '';
					
			// Se hora possuir apenas 5 digitos
			if( hora.length == 5 ){
				d = new Date();
				hora = d.getFullYear() +'-'+ parseInt( d.getMonth() + 1 ) +'-'+ d.getDate();
			}
			
			
			$.each( $( '.content' ), function( index, valor ){
				
				$.each( $( valor ).find( 'input' ), function( index, valor ){
					
					elem = $( valor );
					
					
					if( elem.prop( 'name' ) != radio ){
							
						// auxiliar para impedir repetir os radios
						radio = elem.prop( 'name' );
						
						// campos de radio, checagem e select
						if( elem.prop( 'type' ) == 'radio' || elem.prop( 'type' ) == 'select' ){
							
							resposta = $( 'input[name='+ elem.prop( 'name' ) +']:checked' ).val();
							
							console.log( radio );
							console.log( resposta );
							
							configuracoes_salvar( radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );

							configuracoes_salvar( radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			phonon.notif( "Dados salvos com sucesso", 3000, false );
			
		}
		
		
	}
});