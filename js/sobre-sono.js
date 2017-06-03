$(function(){

	sobre_sono = {
		
		
		init:function(){
			
			$( 'sobre input' ).click( function(){
				
				// mostra o campo especifique caso a opção SIM esteja marcada na questão 8
				if( $( ' .questao-8-sim' ).is( ':checked' ) ){
					$( ' .questao-8-especifique' ).slideDown();
				}else{
					$( ' .questao-8-especifique' ).slideUp();
				}
				
				
				// mostra o campo especifique caso a opção SIM esteja marcada na questão 9
				if( $( ' .questao-9-sim' ).is( ':checked' ) ){
					$( ' .questao-9-especifique' ).slideDown();
				}else{
					$( ' .questao-9-especifique' ).slideUp();
				}
			});
			
			
			$( '.content' ).click( function(){
				sim9 = $( ' .questao-9-sim' ).is( ':checked' );
				nao9 = $( ' .questao-9-nao' ).is( ':checked' );
				sim8 = $( ' .questao-8-sim' ).is( ':checked' );
				nao8 = $( ' .questao-8-nao' ).is( ':checked' );
				
				if( ( $( '.swiper-button-next' ).hasClass( 'swiper-button-disabled' ) ) && ( ( sim8 ) || ( nao8 ) ) && ( ( sim9 ) || ( nao9 ) ) ){
					$( 'sobre .btn-salvar' ).show();
				}else{
					$( 'sobre .btn-salvar' ).hide();
				}
			});
			
			
			
			$( 'sobre .btn-salvar' ).click(function(){
				//phonon.preloader( '.circle-progress' ).show();
				
				sobre_sono.respostas();
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
			
			
			$.each( $( '.questao' ), function( index, valor ){
				
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
							
							sobre_sono_salvar( hora, radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );
							
							sobre_sono_salvar( hora, radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			phonon.notif( "Dados salvos com sucesso", 3000, false );
			phonon.navigator().changePage( 'principal' );
		}
		
		
	}
});