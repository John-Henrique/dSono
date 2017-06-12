phonon.options({
    navigator: {
        defaultPage: 'principal',
        animatePages: true,
        enableBrowserBackButton: true,
        templateRootDirectory: './telas'
    },

    i18n: { // i18n: null if you do not want to use internationalization
        directory: 'idiomas/',
        localeFallback: 'pt-BR',
        localePreferred: 'pt-BR'
    }
});

var app = phonon.navigator();

app.on({page: 'principal', preventClose: false, content: 'principal.html', readyDelay:1},function( activity ){

	activity.onCreate(function(){
		document.addEventListener('deviceready', function() {
		  $('#native-alert-test').click(nativeAlertTest);
		  $('#echo-test').click(echoTest);
		  $('#self-test').click(selfTest);
		  $('#reload').click(reload);
		  $('#string-test-1').click(stringTest1);
		  $('#string-test-2').click(stringTest2);
		  $('#show-count').click(showCount);
		  $('#add-record').click(addRecord);
		  $('#add-json-records-after-delay').click(addJSONRecordsAfterDelay);
		  $('#delete-records').click(deleteRecords);
		  $('#delete-database').click(deleteDatabase);
		  $('#location-page2').click(goToPage2);
		  $('#exportar-db').click();
		  
		  anexo.init();

			//phonon.notif( "INICIANDO DATABASE.JS", 3000, false );
		  initDatabase();
		});
	});
	
	activity.onReady(function(){
		
	});
});


app.on({page: 'diario-atividade', preventClose: false, content: 'diario-atividade.html', readyDelay:1},function( activity ){
	
	var atividade = null;
	
	activity.onCreate(function(){
		diario_atividade.init();
	});
	
	activity.onReady(function(){
		
		document.addEventListener( 'deviceready', function(){
			atividade_listar( getDia() );
		});
	});
});

app.on({page: 'sobre', preventClose: false, content: 'sobre.html', readyDelay:1},function( activity ){
	
	activity.onCreate(function(){
		
		
		//$( '.questoes:first' ).show();
		helper();
		
		sobre_sono.init();
		
	});
	
	activity.onReady(function(){
		
	});
	
	
	activity.onHidden(function(){
		//mySwiper.slideTo( 0,1000,false );
	});
	
});


// não tem ações lógicas
app.on({page: 'qualidade', preventClose: true, content: 'qualidade.html', readyDelay: 1}, function(activity) {
	// apenas mostra o menu
});



app.on({page: 'sonolencia-diurna', preventClose: true, content: 'sonolencia-diurna.html', readyDelay: 1}, function(activity){
	
	
	activity.onCreate(function(){
		
		
		helper();
		
		sonolencia_diurna.init();
	});
	
	activity.onReady(function(){});
	
	
	activity.onHidden(function(){
		//mySwiper.slideTo( 0,1000,false );
	});
	
});


app.on({page: 'gravidade-insonia', preventClose: true, content: 'gravidade-insonia.html', readyDelay: 1}, function(activity){
	
	
	activity.onCreate(function(){
		
		helper();
		
		gravidade_insonia.init();
	});
	
	activity.onReady(function(){});
	
	
	activity.onHidden(function(){
		//mySwiper.slideTo( 0,1000,false );
	});
	
});

app.on({page: 'qualidade-sono', preventClose: true, content: 'qualidade-sono.html', readyDelay: 1}, function(activity){
	
	
	activity.onCreate(function(){
		
		helper();
		/*
		$( '.hora-noite' ).timepicker({
			minTime:'19:00pm', 
			maxTime:'06:00am', 
			show2400:true, 
			timeFormat:'H:i'
		});
		
		$( '.hora-manha' ).timepicker({
			minTime:'05:00am', 
			maxTime:'12:00am', 
			show2400:true, 
			timeFormat:'H:i'
		});
		*/
		qualidade_sono.init();
	});
	
	activity.onReady(function(){});
	
	
	activity.onHidden(function(){
		//mySwiper.slideTo( 0,1000,false );
	});
	
});


app.on({page: 'preferencia-diurna', preventClose: true, content: 'preferencia-diurna.html', readyDelay: 1}, function(activity){
	
	
	activity.onCreate(function(){
		
		helper();
		/*
		$( '.hora-noite' ).timepicker({
			minTime:'19:00pm', 
			maxTime:'06:00am', 
			show2400:true, 
			timeFormat:'H:i'
		});
		
		$( '.hora-manha' ).timepicker({
			minTime:'05:00am', 
			maxTime:'12:00am', 
			show2400:true, 
			timeFormat:'H:i'
		});
		*/
		
		preferencia_diurna.init();
	});
	
	activity.onReady(function(){});
	
	
	activity.onHidden(function(){
		//mySwiper.slideTo( 0,1000,false );
	});
	
});

app.on({page: 'apneia', preventClose: true, content: 'apneia.html', readyDelay: 1}, function(activity){
	
	
	activity.onCreate(function(){
		
		helper();
		
		apneia.init();
	});
	
	activity.onReady(function(){});
	
	
	activity.onHidden(function(){
		//mySwiper.slideTo( 0,1000,false );
	});
	
});


app.on({page: 'enviar', preventClose: true, content: 'enviar.html', readyDelay: 1}, function(activity) {
	
	activity.onCreate(function(){
		
		$( 'enviar .btn-salvar' ).click( function(){
			
			document.addEventListener( 'deviceready', function(){
				gera_relatorios();
			});
		});
	});
	
	
});

app.on({page: 'configuracoes', preventClose: true, content: 'configuracoes.html', readyDelay: 1}, function(activity) {
	
	activity.onCreate( function(){
		document.addEventListener( 'deviceready', function(){
			configuracoes.init();
		});
	});
	
	
	activity.onReady(function(){
		
		document.addEventListener( 'deviceready', function(){
			// lista as configurações salvas
			configuracoes_listar();
		});
	});
	
});

app.on({page: 'perfil', preventClose: true, content: 'perfil.html', readyDelay: 1}, function(activity) {
	
	activity.onCreate( function(){
		document.addEventListener( 'deviceready', function(){
			perfil.init();
		});
	});
	
	
	
	activity.onReady(function(){
		
		document.addEventListener( 'deviceready', function(){
			// lista as configurações salvas
			perfil_listar();
		});
	});
});


lang = localStorage.getItem( 'idioma' );
if( lang ){
	console.log( lang );
	phonon.updateLocale( lang );
}

// Let's go!
app.start();