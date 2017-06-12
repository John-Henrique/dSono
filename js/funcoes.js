$(function(){
	
	document.on('pageopened', function(evt) {
		///console.log(evt.detail.page + ' is opened for the first time (created)');
		
		
		/**
		 * Para remover as setas de navegação 
		 * das questões de cada questionário
		 **/
		setTimeout(function(){
			currentPage = phonon.navigator().currentPage;
			//console.log( currentPage );
			$( currentPage +' .swiper-button-next, '+ currentPage +' .swiper-button-prev' ).hide();
		}, 4000);
	});
	
});


/**
 * Retorna a data atual no formato 
 * AAAA-MM-DD
 **/
function getDia(){
	
	dia = new Date();
	m = parseInt( dia.getMonth() + 1 );
	d = dia.getDate();
	mes = ( m < 10 )? '0'+ m:m; // caso o mês seja menor que 10
	d = ( d < 10 )? '0'+ d:d; // caso o dia seja menor que 10
	return dia.getFullYear() +'-'+ mes +'-'+ d;
}




var mySwiper = '';


function limpar_campos(){

	$.each( $( phonon.navigator().currentPage +' .content .campo' ), function( index, valor ){
		
		if( $( valor ).prop( 'type' ) == 'text' ){
			$( valor ).val('');
		}
		
		
		if( $( valor ).prop( 'type' ) == 'radio' ){
			$( valor ).prop( 'checked', false );
		}
	});
}



function formatacoes(){
	$( '.hora' ).timepicker();
}


function helper(){
	
	tela = phonon.navigator().currentPage;
	
	formatacoes();
	

	/**
	 * Ação para salvar dados das questões
	 **/
	 /*
	$( tela +' .btn-salvar' ).click(function(){
		
		setTimeout(function(){
			
			limpar_campos();
			mySwiper.slideTo( 0,1000,false );
			phonon.navigator().changePage( "principal" );
			
		}, 1500 );
	});
	*/

	/**
	 * Ações para exibir e esconder o botão de próximo 
	 * da navegação de rolagem
	 **/
	$( '.content' ).click( function(){
		if( $( tela +' .swiper-button-next' ).hasClass( 'swiper-button-disabled' ) ){
			$( tela +' .btn-salvar' ).show();
		}else{
			$( tela +' .btn-salvar' ).hide();
		}
	});
	
	

	mySwiper = new Swiper('.swiper-container', {
		// Optional parameters
		direction: 'horizontal',
		loop: false, 
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev',
		pagination: '.swiper-pagination',
		paginationType: 'fraction'
	});
		
}