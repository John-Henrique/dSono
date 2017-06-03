$(function(){

	qualidade_sono = {
		
		
		init:function(){
			
			$( 'qualidade-sono input' ).click( function(){
				
				// mostra o campo comentario caso a opção SIM esteja marcada na questão 18
				if( $( ' .questao-18' ).is( ':checked' ) ){
					$( ' .questao-18-comentario' ).slideDown();
				}else{
					$( ' .questao-18-comentario' ).slideUp();
				}
			});
			
			
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
				q11 = $( ' .questao-7' ).is( ':checked' );
				q12 = $( ' .questao-7' ).is( ':checked' );
				q13 = $( ' .questao-7' ).is( ':checked' );
				q14 = $( ' .questao-7' ).is( ':checked' );
				q15 = $( ' .questao-7' ).is( ':checked' );
				q16 = $( ' .questao-7' ).is( ':checked' );
				q17 = $( ' .questao-7' ).is( ':checked' );
				q18 = $( ' .questao-7' ).is( ':checked' );
				q19 = $( ' .questao-7' ).is( ':checked' );
				q20 = $( ' .questao-7' ).is( ':checked' );
				
				if( ( $( '.swiper-button-next' ).hasClass( 'swiper-button-disabled' ) ) && ( q1 ) && ( q2 ) && ( q3 ) && ( q4 ) && ( q5 ) && ( q6 ) && ( q7 ) && ( q8 ) && ( q9 ) && ( q10 ) && ( q11 ) && ( q12 ) && ( q13 ) && ( q14 ) && ( q15 ) && ( q16 ) && ( q17 ) && ( q18 ) && ( q19 ) && ( q20 ) ){
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
							
							qualidade_sono_salvar( hora, radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							
							console.log( radio );
							console.log( resposta );
							
							qualidade_sono_salvar( hora, radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			phonon.notif( "Dados salvos com sucesso", 3000, false );
			phonon.navigator().changePage( 'qualidade' );
		}
		
		
	}
});