$(function(){

	gravidade_insonia = {
		
		
		init:function(){
			
			
			
			$( '.content' ).click( function(){
				q1 = $( ' .questao-1' ).is( ':checked' );
				q2 = $( ' .questao-2' ).is( ':checked' );
				q3 = $( ' .questao-3' ).is( ':checked' );
				q4 = $( ' .questao-4' ).is( ':checked' );
				q5 = $( ' .questao-5' ).is( ':checked' );
				q6 = $( ' .questao-6' ).is( ':checked' );
				q7 = $( ' .questao-7' ).is( ':checked' );
				
				if( ( $( '.swiper-button-next' ).hasClass( 'swiper-button-disabled' ) ) && ( q1 ) && ( q2 ) && ( q3 ) && ( q4 ) && ( q5 ) && ( q6 ) && ( q7 ) ){
					$( 'gravidade-insonia .btn-salvar' ).show();
				}else{
					$( 'gravidade-insonia .btn-salvar' ).hide();
				}
			});
			
			
			
			$( 'gravidade-insonia .btn-salvar' ).click(function(){
				//phonon.preloader( '.circle-progress' ).show();
				
				gravidade_insonia.respostas();
			});
			
		},
		
		
		respostas: function(){
			hora = getDia() +' 00:00:11';
			radio = '';
					
			
			
			$.each( $( 'gravidade-insonia .questao' ), function( index, valor ){
				
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
							
							//gravidade_insonia_salvar( hora, radio, resposta );
							cpt_adicionar( hora, 'gravidade-insonia', radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );
							
							//gravidade_insonia_salvar( hora, radio, resposta );
							cpt_adicionar( hora, 'gravidade-insonia', radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			phonon.notif( "Dados salvos com sucesso", 3000, false );
			phonon.navigator().changePage( 'qualidade' );
		}
		
		
	}
});