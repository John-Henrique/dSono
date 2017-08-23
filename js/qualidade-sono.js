$(function(){

	qualidade_sono = {
		
		
		init:function(){
			
			$( 'qualidade-sono input' ).click( function(){
				
				// mostra o campo comentario caso a opção SIM esteja marcada na questão 18
				if( $( 'qualidade-sono .questao-18' ).is( ':checked' ) ){
					$( 'qualidade-sono .questao-18-comentario' ).slideDown();
				}else{
					$( 'qualidade-sono .questao-18-comentario' ).slideUp();
				}
			});
			
			
			$( '.content' ).click( function(){
				q1 = $( ' .questao-1' ).val();
				q2 = $( ' .questao-2' ).val();
				q3 = $( ' .questao-3' ).val();
				q4 = $( ' .questao-4' ).val();
				q5 = $( ' .questao-5' ).is( ':checked' );
				q6 = $( ' .questao-6' ).is( ':checked' );
				q7 = $( ' .questao-7' ).is( ':checked' );
				q8 = $( ' .questao-8' ).is( ':checked' );
				q9 = $( ' .questao-9' ).is( ':checked' );
				q10 = $( ' .questao-10' ).is( ':checked' );
				q11 = $( ' .questao-11' ).is( ':checked' );
				q12 = $( ' .questao-12' ).is( ':checked' );
				q13 = $( ' .questao-13' ).is( ':checked' );
				q14 = $( ' .questao-14' ).is( ':checked' );
				q15 = $( ' .questao-15' ).is( ':checked' );
				q16 = $( ' .questao-16' ).is( ':checked' );
				q17 = $( ' .questao-17' ).is( ':checked' );
				q18 = $( ' .questao-18' ).is( ':checked' );
				q19 = $( ' .questao-19' ).is( ':checked' );
				q20 = $( ' .questao-20' ).is( ':checked' );
				
				if( ( $( '.swiper-button-next' ).hasClass( 'swiper-button-disabled' ) ) && ( q1 != '' ) && ( q2 != '' ) && ( q3 != '' ) && ( q4 != '' ) && ( q5 ) && ( q6 ) && ( q7 ) && ( q8 ) && ( q9 ) && ( q10 ) && ( q11 ) && ( q12 ) && ( q13 ) && ( q14 ) && ( q15 ) && ( q16 ) && ( q17 ) && ( q18 ) && ( q19 ) && ( q20 ) ){
					$( 'qualidade-sono .btn-salvar' ).show();
				}else{
					$( 'qualidade-sono .btn-salvar' ).hide();
				}
			});
			
			
			
			$( 'qualidade-sono .btn-salvar' ).click(function(){
				//phonon.preloader( '.circle-progress' ).show();
				
				qualidade_sono.respostas();
			});
			
		},
		
		
		respostas: function(){
			hora = getDia() +' 00:00:11';
			radio = '';
					
			
			$.each( $( 'qualidade-sono .questao' ), function( index, valor ){
				
				$.each( $( valor ).find( 'input' ), function( index, valor ){
					
					elem = $( valor );
					
					
					if( elem.prop( 'name' ) != radio ){
							
						// auxiliar para impedir repetir os radios
						radio = elem.prop( 'name' );
						
						// campos de radio, checagem e select
						if( elem.prop( 'type' ) == 'radio' || elem.prop( 'type' ) == 'select' ){
							//console.log( elem.prop( 'class' ) );
							resposta = $( 'input[name='+ elem.prop( 'name' ) +']:checked' ).val();
							
							console.log( radio );
							console.log( resposta );
							
							///  qualidade_sono_salvar( hora, radio, resposta );
							cpt_adicionar( hora, 'qualidade-sono', radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );
							
							//qualidade_sono_salvar( hora, radio, resposta );
							cpt_adicionar( hora, 'qualidade-sono', radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			phonon.navigator().changePage( 'qualidade' );
			phonon.notif( "Dados salvos com sucesso", 3000, false );
		}
		
		
	}
});