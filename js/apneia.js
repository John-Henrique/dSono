$(function(){

	apneia = {
		
		
		init:function(){
			
			$( 'apneia .content' ).click( function(){
				q1 = $( 'apneia .questao-1' ).is( ':checked' );
				q2 = $( 'apneia .questao-2' ).is( ':checked' );
				q3 = $( 'apneia .questao-3' ).is( ':checked' );
				q4 = $( 'apneia .questao-4' ).is( ':checked' );
				q5 = $( 'apneia .questao-5' ).is( ':checked' );
				q6 = $( 'apneia .questao-6' ).is( ':checked' );
				q7 = $( 'apneia .questao-7' ).is( ':checked' );
				q8 = $( 'apneia .questao-8' ).is( ':checked' );
				q9 = $( 'apneia .questao-9' ).is( ':checked' );
				q10 = $( 'apneia .questao-10' ).val();
				
				if( ( $( '.swiper-button-next' ).hasClass( 'swiper-button-disabled' ) ) && ( q1 ) && ( q2 ) && ( q3 ) && ( q4 ) && ( q5 ) && ( q6 ) && ( q7 ) && ( q8 ) && ( q9 ) && ( q10 != '' ) ){
					$( 'apneia .btn-salvar' ).show();
				}else{
					$( 'apneia .btn-salvar' ).hide();
				}
			});
			
			
			
			$( 'apneia .btn-salvar' ).click(function(){
				//phonon.preloader( '.circle-progress' ).show();
				
				apneia.respostas();
			});
			
		},
		
		
		respostas: function(){
			hora = getDia() +' 00:00:01';
			radio = '';
					
			// Se hora possuir apenas 5 digitos
			if( hora.length == 5 ){
				d = new Date();
				hora = d.getFullYear() +'-'+ parseInt( d.getMonth() + 1 ) +'-'+ d.getDate();
			}
			
			
			$.each( $( 'apneia .questao' ), function( index, valor ){
				
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
							
							//apneia_salvar( hora, radio, resposta );
							cpt_adicionar( hora, 'apneia', radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );
							
							//apneia_salvar( hora, radio, resposta );
							cpt_adicionar( hora, 'apneia', radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			phonon.notif( "Dados salvos com sucesso", 3000, false );
			phonon.navigator().changePage( 'qualidade' );
		}
		
		
	}
});