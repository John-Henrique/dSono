$(function(){

	diario_atividade = {
		
		
		init:function(){
			$( '.atividades button' ).click(function(){
				
				atividade = $( this ).data( 'id' ).replace( ' ', '-' );
				atividadeTexto = $( this ).text().replace( ' ', '-' );
				//console.log( $( this ).text() );
				
				// remove a classe positive de todos os botões
				$( '.atividades button' ).removeClass( 'negative' );
				
				// adiciona a classe negative para marcar o botão
				$( '.atividades button[data-id='+ atividade +']' ).addClass( 'negative' ).data( '' );
			});
			
			
			
			$( '.horario li' ).click(function(){
				
				// atalho para acessar o li clicado
				li = this;
				
				// se existir um botão marcado com negative
				if( $( '.atividades button' ).hasClass( 'negative' ) ){
					
					// somente quando o botão limpar não estiver marcado
					if( atividade != 'limpar' ){
						
						$( li ).find( 'a:first' ).removeClass( $( li ).find( 'a:first' ).prop( 'class' ) ).addClass( 'pull-right icon icon-'+ atividade );
						//$( li ).find( 'a:last span' ).text( ' - '+ atividade.replace( '-', ' ' ) );
						$( li ).find( 'a:last span' ).text( ' - '+ atividadeTexto.replace( '-', ' ' ) );
					}else{
						$( li ).find( 'a:first' ).removeClass( $( li ).find( 'a:first' ).prop( 'class' ) ).addClass( 'pull-right icon' );
						$( li ).find( 'a:last span' ).text( '' );
					}
				}
			});
			
			
			
			$( 'diario-atividade .btn-salvar' ).click(function(){
				
				$.each( $( '.horario li' ).find( 'a:last' ), function( index, valor ){
					
					str 		= $( valor ).text().split( ' - ' );
					atividade 	= str[1];
					hora		= str[0];
					
					// caso a atividade não seja definida
					if( atividade == undefined ){
						// atividade pode ser salva mesmo não definida
						atividade = ' ';
					}
					
					
					// Se hora possuir apenas 5 digitos
					if( hora.length == 5 ){
						d = new Date();
						hora = d.getFullYear() +'-'+ parseInt( d.getMonth() + 1 ) +'-'+ d.getDate() +' '+ hora;
					}
					
					// salvar na base
					//console.log( 'Hora: '+ hora +'  valor: '+ atividade );
					atividade_existe( hora, atividade );
					
				});
				
				phonon.notif( "Diário atualizado", 3000, false );
				phonon.navigator().changePage( 'principal' );

			});
			
		}
		
		
	}
});