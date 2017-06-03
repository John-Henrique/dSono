$(function(){

	perfil = {
		
		
		init:function(){
			
			$( 'perfil .btn-salvar' ).click(function(){
				
				perfil.respostas();
			});
			
			
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
							
							perfil_salvar( radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );

							perfil_salvar( radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			
			
			phonon.notif( "Dados salvos com sucesso", 3000, false );
		}
		
		
	}
});