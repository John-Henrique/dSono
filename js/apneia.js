$(function(){

	apneia = {
		
		
		init:function(){
			
			$( '.content' ).click( function(){
				q1 = $( ' .questao-1' ).is( ':checked' );
				q2 = $( ' .questao-2' ).is( ':checked' );
				q3 = $( ' .questao-3' ).is( ':checked' );
				q4 = $( ' .questao-4' ).is( ':checked' );
				q5 = $( ' .questao-5' ).is( ':checked' );
				q6 = $( ' .questao-6' ).is( ':checked' );
				q7 = $( ' .questao-7' ).is( ':checked' );
				q8 = $( ' .questao-7' ).is( ':checked' );
				q9 = $( ' .questao-7' ).is( ':checked' );
				q10 = $( ' .questao-7' ).is( ':checked' );
				
				if( ( $( '.swiper-button-next' ).hasClass( 'swiper-button-disabled' ) ) && ( q1 ) && ( q2 ) && ( q3 ) && ( q4 ) && ( q5 ) && ( q6 ) && ( q7 ) && ( q8 ) && ( q9 ) && ( q10 ) ){
					$( 'qualidade-sono .btn-salvar' ).show();
				}else{
					$( 'qualidade-sono .btn-salvar' ).hide();
				}
			});
			
			
			
			$( 'apneia .btn-salvar' ).click(function(){
				//phonon.preloader( '.circle-progress' ).show();
				
				apneia.respostas();
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
							
							apneia_salvar( hora, radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );
							
							apneia_salvar( hora, radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			phonon.notif( "Dados salvos com sucesso", 3000, false );
			phonon.navigator().changePage( 'qualidade' );
		}
		
		
	}
});