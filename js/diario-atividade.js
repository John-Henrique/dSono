$(function(){

	diario_atividade = {
		
		
		init:function(){
			
			/**
			 * garantinhdo que a consulta seja realizada 
			 * sempre que a tela for carregada
			 * */
			document.on('pageopened', function(evt){
				
				if( phonon.navigator().currentPage == 'diario-atividade' ){
					atividade_listar( sessionStorage.getItem( 'data' ) );
				}
			});
			
			
			$( '.dia-hoje, .dia-hoje-display input' ).val( getDia() );
			
			
			/**
			 * Para exibir o calendário nativo 
			 * basta dar click no campo, para 
			 * isso, defini um botão 'calendario' 
			 * na barra de titulo, quando clicar 
			 * nele, abre o calendário nativo 
			 * ao selecionar uma data neste calendario 
			 * o campo .data-hoje guarda a data 
			 * que será utilizada na hora de salvar
			 * os dados
			 **/
			$( '.calendario' ).click( function(){
				
				/**
				 * Campo de texto do tipo date
				 **/
				$( '.dia-hoje' ).click();
			});
			
			
			/**
			 * Sempre que o valor do campo for alterado
			 * iremos atualizar a informação da DIV 
			 * para permitir que o usuário saiba 
			 * que dia está sendo informado
			 **/
			$( '.dia-hoje' ).change(function(){
				el 	= $( '.dia-hoje-display input' );
				dia = $( '.dia-hoje' ).val();
				
				$.each( el, function(i, v){
					$( v ).val( dia )
					console.log( dia );
				});
				
				sessionStorage.setItem( 'data', dia ); // Não sei onde está sendo utilizado
				atividade_listar( dia );
				
			});
			
			
			$( '.atividades button' ).click(function(){
				
				atividade = $( this ).data( 'id' ).replace( ' ', '-' );
				atividadeTexto = $( this ).text().replace( ' ', '-' );
				//console.log( $( this ).text() );
				
				// remove a classe positive de todos os botões
				$( '.atividades button' ).removeClass( 'negative' );
				
				// adiciona a classe negative para marcar o botão
				$( '.atividades button[data-id='+ atividade +']' ).addClass( 'negative' ).data( '' );
			});
			
			
			
			/**
			 * Marca as atividades nos Lista
			 **/
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
				}else{
					console.log( "nenhuma atividade selecionada");
					/*
					 * quando o usuário clicar em alguma 
					 * hora sem ter escolhido uma atividade 
					 * devemos informá-lo
					 **/
					var dialogo = phonon.dialog( "#dialogo-diario-atividade" ).open();
					dialogo.on( 'confirm', function(){
						$('.tab-content').animate({
							scrollTop: 0
						}, 1000);
					});
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
					if( ( hora.length == 5 ) && ( sessionStorage.getItem( 'data' ) == null ) ){
						hora = getDia() +' '+ hora +':00';
					}else{
						hora = sessionStorage.getItem( 'data' ) +' '+ hora;
					}
					
					// salvar na base
					//console.log( index +' Hora: '+ hora +'  valor: '+ atividade );
					// hora precisa estar no formado AAAA-MM-DD HH:MM
					//atividade_existe( hora, atividade );
					
					/**
					 * Novo método, mais flexivel
					 * */
					cpt_adicionar( hora, 'diario', str[0], atividade );
					
				});
				
				phonon.notif( "Diário atualizado", 3000, false );
				phonon.navigator().changePage( 'principal' );

			});
			
		}
		
		
	}
});