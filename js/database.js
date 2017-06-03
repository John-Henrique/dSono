var database = null;

var nextUser = 101;

function initDatabase() {
	database = window.sqlitePlugin.openDatabase({name: 'diariodosono.db', location: 'default'});
	//navigator.notification.alert( "DATABASE");
	criaTabelas();
}


function criaTabelas(){
		
		database.transaction( function( tx ){
			tabela = 
					'CREATE TABLE IF NOT EXISTS "ds_options" ( '+
					'`option_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, '+
					'`option_name`	TEXT NOT NULL, '+
					'`option_value`	INTEGER DEFAULT 0, '+
					'`autoload`		INTEGER DEFAULT 0 '+
				')';
				
			tx.executeSql( tabela, [], 
			function( tx, res ){
				//navigator.notification.alert( "tabela ds_options criada" );
				/*
				tx.executeSql('INSERT INTO ds_options (option_name, option_value) VALUES (?,?)', ['email_medico', '']);
				tx.executeSql('INSERT INTO ds_options (option_name, option_value) VALUES (?,?)', ['user_sexo', '']);
				tx.executeSql('INSERT INTO ds_options (option_name, option_value) VALUES (?,?)', ['user_nome', '']);
				tx.executeSql('INSERT INTO ds_options (option_name, option_value) VALUES (?,?)', ['user_nascimento', '']);
				 * */
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO ds_options '+ res.code +' '+ res.message  );
			}); 
			
			
			tabela = 
					'CREATE TABLE IF NOT EXISTS "ds_posts" ( '+
					'`ID`			INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, '+
					'`post_title`	TEXT DEFAULT \' \', '+
					'`post_content`	TEXT, '+
					'`post_status`	TEXT DEFAULT \'draft\', '+
					'`post_type`	TEXT DEFAULT \'post\', '+
					'`post_date`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP '+
					')';
				
			tx.executeSql( tabela, [], 
			function( tx, res ){
				//navigator.notification.alert( "tabela ds_posts criada" );
				/*
				tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_status) VALUES (?,?,?)', ['atividades', 'Trabalho', 'publish']);
				tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_status) VALUES (?,?,?)', ['atividades', 'Transporte', 'publish']);
				tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_status) VALUES (?,?,?)', ['atividades', 'Atividade física', 'publish']);
				tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_status) VALUES (?,?,?)', ['atividades', 'Cochilo', 'publish']);
				tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_status) VALUES (?,?,?)', ['atividades', 'Estudo', 'publish']);
				 * */
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO ds_posts '+ res.code +' '+ res.message  );
			}); ;
			
			
			
		}, function(erro){
			navigator.notification.alert("SQLite: criaTabelas "+ erro.code +" : "+ erro.message +'   '+ JSON.stringify( res ) );
		}, function(){
			//navigator.notification.alert("SQLite: consulta realizada");
		});
	
	}


	/**
	 * Verifica se a atividade já foi registrada 
	 * no dia selecionado
	 * @date 2017-05-28
	 * */
	function atividade_existe( data_hora, atividade ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE post_date=? "+
							"AND post_title=? "+
							"AND post_type='diario' "+
							"LIMIT 1 "
							, [data_hora, atividade], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade > 1 ){
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_status=? WHERE post_date=?', ['diario', atividade, data_hora, 'publish', data_hora]);
				}else{
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status) VALUES (?,?,?,?)', ['diario', atividade, data_hora, 'publish']);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO atividade_existe '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta atividade_existe "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}

	
	/*
	 * Lista as informações de perfil já registradas 
	 * 
	 * */
	function perfil_listar( ){

		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT option_name, option_value "+
							"FROM ds_options "+
							"ORDER BY option_id ASC " 
							,[], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade > 1 ){
					
					for( i=0; i < quantidade; i++ ){
						
						console.log( res.rows.item( i ).option_name +' '+ res.rows.item( i ).option_value );
						$( 'configuracoes input[name="'+ res.rows.item( i ).option_name +'"' ).val( res.rows.item( i ).option_value );
					}
					
				}
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO perfil_listar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta perfil_listar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}



	
	/*
	 * Lista as configurações já registradas 
	 * 
	 * */
	function configuracoes_listar( ){

		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT option_name, option_value "+
							"FROM ds_options "+
							"ORDER BY option_id ASC " 
							,[], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade > 1 ){
					
					for( i=0; i < quantidade; i++ ){
						
						console.log( res.rows.item( i ).option_name +' '+ res.rows.item( i ).option_value );
						$( 'configuracoes input[name="'+ res.rows.item( i ).option_name +'"' ).val( res.rows.item( i ).option_value );
					}
					
				}
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO atividade_listar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta atividade_listar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}


	
	/*
	 * Lista as atividades já registradas
	 * assim, já destacamos os itens com 
	 * seus icones 
	 * 
	 * @param data informar uma data válida 2017-05-28 sem hora
	 * */
	function atividade_listar( data ){

		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID, post_title, strftime( '%Y-%m-%d %H:%M', post_date ) AS hora1, post_date "+
							"FROM ds_posts "+
							"WHERE /*strftime( '%Y-%m-%d', post_date )=?*/ "+ 
							"/*AND*/ post_type=? "+
							"ORDER BY post_date ASC "
							,['diario'], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				//phonon.notif( "quantidade "+ quantidade, 3000, false );
				
				if( quantidade > 1 ){
					
					for( i=0; i < quantidade; i++ ){
						
						//li = $( 'diario-atividade li:contains("'+ res.rows.item( i ).post_date.substring( 11 ) +'")' );
						li = $( 'diario-atividade li[data-hora="hora-'+ res.rows.item( i ).post_date.substring( 10 ).replace(':','') +'"]' );
						
						li.find( 'a:first' ).addClass( 'icon-'+ res.rows.item( i ).post_title );
						
						atividade = ' - '+ res.rows.item( i ).post_title;
						if( atividade.length != 3 ){
							li.find( 'a:last span' ).text( atividade );
							//console.log( res.rows.item( i ).post_date.substring( 10 ) +' '+ res.rows.item( i ).post_title +' '+ res.rows.item( i ).post_date.substring( 10 ).replace(':','') );
						}
					}
					
				}else{
					// nada encontrado
				}
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO atividade_listar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta atividade_listar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}



	/*
	 * Gera relatórios fisicos 
	 * para enviar ao médico
	 * */
	function gera_relatios(){
		gera_relatorio_apneia();
		gera_relatorio_sobre_sono();
		gera_relatorio_qualidade_sono();
		gera_relatorio_diario_atividade();
		gera_relatorio_gravidade_insonia();
		gera_relatorio_sonolencia_diurna();
		gera_relatorio_preferencia_diurna();
	}


	/**
	 * Gera relatório do preferencia diurna
	 * */
	function gera_relatorio_preferencia_diurna(){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['preferencia-diurna'], function(ignored, resultSet) { //
				
				dados	= '';
				
				for(i=0; i<resultSet.rows.length; i++){
					console.log( resultSet.rows.item( i ).content );
					dados  = dados + resultSet.rows.item( i ).content +';';
					
					if( (i%8) == 0 ){
						dados = dados +"\r\n";
					}
				}
				
				// removendo o último ponto e virgula da string
				//dados  =  dados.substring( 0, dados.length-1 );
				
				
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, 'preferencia-diurna'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				
			});
			
			
				phonon.notif( "gera_relatorio_preferencia_diurna ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_preferencia_diurna error: ' + error.message);
		});
		
	}
	




	/**
	 * Gera relatório do gravidade insonia
	 * */
	function gera_relatorio_gravidade_insonia(){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['graviade-insonia'], function(ignored, resultSet) { //
				
				dados	= '';
				
				for(i=0; i<resultSet.rows.length; i++){
					console.log( resultSet.rows.item( i ).content );
					dados  = dados + resultSet.rows.item( i ).content +';';
					
					if( (i%8) == 0 ){
						dados = dados +"\r\n";
					}
				}
				
				// removendo o último ponto e virgula da string
				//dados  =  dados.substring( 0, dados.length-1 );
				
				
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, 'graviade-insonia'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				
			});
			
			
				phonon.notif( "gera_relatorio_gravidade_insonia ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_gravidade_insonia error: ' + error.message);
		});
		
	}
	



	/**
	 * Gera relatório do sonolencia diurna
	 * */
	function gera_relatorio_sonolencia_diurna(){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['sonolencia-diurna'], function(ignored, resultSet) { //
				
				dados	= '';
				
				for(i=0; i<resultSet.rows.length; i++){
					console.log( resultSet.rows.item( i ).content );
					dados  = dados + resultSet.rows.item( i ).content +';';
					
					if( (i%8) == 0 ){
						dados = dados +"\r\n";
					}
				}
				
				// removendo o último ponto e virgula da string
				//dados  =  dados.substring( 0, dados.length-1 );
				
				
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, 'sonolencia-diurna'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				
			});
			
			
				phonon.notif( "gera_relatorio_sonolencia_diurna ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_sonolencia_diurna error: ' + error.message);
		});
		
	}
	


	/**
	 * Gera relatório do qualidade sono
	 * */
	function gera_relatorio_qualidade_sono(){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['qualidade-sono'], function(ignored, resultSet) { //
				
				dados	= '';
				
				for(i=0; i<resultSet.rows.length; i++){
					console.log( resultSet.rows.item( i ).content );
					dados  = dados + resultSet.rows.item( i ).content +';';
					
					if( (i%8) == 0 ){
						dados = dados +"\r\n";
					}
				}
				
				// removendo o último ponto e virgula da string
				//dados  =  dados.substring( 0, dados.length-1 );
				
				
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, 'qualidade-sono'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				
			});
			
			
				phonon.notif( "gera_relatorio_qualidade_sono ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_qualidade_sono error: ' + error.message);
		});
		
	}
	


	/**
	 * Gera relatório do apneia
	 * */
	function gera_relatorio_apneia(){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['apneia'], function(ignored, resultSet) { //
				
				dados	= '';
				
				for(i=0; i<resultSet.rows.length; i++){
					console.log( resultSet.rows.item( i ).content );
					dados  = dados + resultSet.rows.item( i ).content +';';
					
					if( (i%8) == 0 ){
						dados = dados +"\r\n";
					}
				}
				
				// removendo o último ponto e virgula da string
				//dados  =  dados.substring( 0, dados.length-1 );
				
				
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, 'apneia'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				
			});
			
			
				phonon.notif( "gera_relatorio_apneia ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_apneia error: ' + error.message);
		});
		
	}
	
	


	/**
	 * Gera relatório do sobre o sono
	 * */
	function gera_relatorio_sobre_sono(){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['sobre-o-sono'], function(ignored, resultSet) { //
				
				dados	= 'DEITOU;LEVANTOU;AVALIA SONO; FACILIDADE PARA ADORMECER;FACILIDADE PARA ACORDAR; INICIO DO DIA; FIM DO DIA;ACORDOU DURANTE NOITE; ACORDOU SOZINHO OU FOI ACORDADO\r\n';
				
				for(i=0; i<resultSet.rows.length; i++){
					console.log( resultSet.rows.item( i ).content );
					dados  = dados + resultSet.rows.item( i ).content +';';
					
					if( (i%8) == 0 ){
						dados = dados +"\r\n";
					}
				}
				
				// removendo o último ponto e virgula da string
				//dados  =  dados.substring( 0, dados.length-1 );
				
				
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, 'sobre-sono'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				
			});
			
			
				phonon.notif( "gera_relatorio_diario_atividade ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_diario_atividade error: ' + error.message);
		});
		
	}
	
	




	/**
	 * Gera relatório do diário de atividades
	 * */
	function gera_relatorio_diario_atividade(){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['diario'], function(ignored, resultSet) { //
				
				dados	= 'DATA/HORA;';
				
				for(i=0; i<resultSet.rows.length; i++){
					//console.log( resultSet.rows.item( i ).post_date.substring( 10 ) );
					dados  = dados + resultSet.rows.item( i ).post_date.substring( 10 ) +';';
				}
				
				// removendo o último ponto e virgula da string
				dados  =  dados.substring( 0, dados.length-1 ) +'\r\n';
				
				
				//console.log( dados );
				
				/**
				 * Roda todas as atividades registradas
				 * */
				transaction.executeSql( "SELECT post_title, post_date, strftime('%Y/%m/%d', post_date) AS dia FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['diario'], function(ignored, resultSet) { //
					
					dia 	= '';
					quebra = '';
					
					for(i=0; i<resultSet.rows.length; i++){
						
						// se o valor de dia for diferente iremos modificar seu valor
						if( ( resultSet.rows.item( i ).post_date.substring( 0, 10 ) != dia ) && ( (i % 48) == 0 ) ){
							//console.log( resultSet.rows.item( i ).post_date.substring( 0, 10 )  );
							dados = dados + resultSet.rows.item(i).post_date.substring( 0, 10 ) +';';
						}
						
						
						// incrementa a variável dados com os novos valores
						dados = dados +  resultSet.rows.item( i ).post_title +';';
						console.log( resultSet.rows.item( i ).post_title );
						
						
						// se o valor de dia for diferente iremos modificar seu valor
						if( ( resultSet.rows.item( i ).post_date.substring( 0, 10 ) != dia ) && ( (i % 48) == 0 ) ){
							dia = resultSet.rows.item(i).post_date.substring( 0, 10 );
							console.log( "quebra de linha "+ i );
							console.log( dia );
							
							if( i != 0 ){
								quebra = "\r\n";
							}else{
								quebra = '';
							}
							
							
							dados = dados +  quebra;
						}
						
						
						quebra = '';
					}
					
					//console.log( dados );
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, "atividades"+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				});
				
			});
			
			
			
			
			
			
				phonon.notif( "gera_relatorio_diario_atividade ", 3000, false );
				
				//anexo.setStrTexto( dados2 );
				
				
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_diario_atividade error: ' + error.message);
		});
		
	}
	
	



	/**
	 * Adiciona informações sobre as 
	 * informações de perfil
	 * @date 2017-05-31
	 * */
	function perfil_salvar( chave, valor ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT option_id "+
							"FROM ds_options "+
							"WHERE option_name=? "+
							"LIMIT 1 "
							, [chave], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_options SET option_value=? WHERE option_name=?', [valor, chave]);
				}else{
					tx.executeSql('INSERT INTO ds_options (option_name, option_value) VALUES (?,?)', [chave, valor]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO perfil_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta perfil_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}




	/**
	 * Adiciona informações sobre as configurações na base de 
	 * dados
	 * @date 2017-05-31
	 * */
	function configuracoes_salvar( chave, valor ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT option_id "+
							"FROM ds_options "+
							"WHERE option_name=? "+
							"LIMIT 1 "
							, [chave], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_options SET option_value=? WHERE option_name=?', [valor, chave]);
				}else{
					tx.executeSql('INSERT INTO ds_options (option_name, option_value) VALUES (?,?)', [chave, valor]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO configuracoes_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta configuracoes_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}



	/**
	 * Adiciona/altera os dados das respostas para PREFERENCIA DIURNA
	 * @var data_hora informar data e hora no formato YYYY-MM-DD (post_date)
	 * @var questao informar o numero da questão (post_title)
	 * @var resposta informar o valor da resposta informada (post_content)
	 * @date 2017-05-31
	 * */
	function preferencia_diurna_salvar( data_hora, questao, resposta ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE post_date=? "+
							"AND post_title=? "+
							"AND post_type='preferencia-diurna' "+
							"LIMIT 1 "
							, [data_hora, questao], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_content=? WHERE post_date=?', ['preferencia-diurna', questao, data_hora, resposta, data_hora]);
				}else{
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status, post_content) VALUES (?,?,?,?,?)', ['preferencia-diurna', questao, data_hora, 'publish', resposta]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO preferencia_diurna_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta preferencia_diurna_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}




	/**
	 * Adiciona/altera os dados das respostas para GRAVIDADE INSONIA
	 * @var data_hora informar data e hora no formato YYYY-MM-DD (post_date)
	 * @var questao informar o numero da questão (post_title)
	 * @var resposta informar o valor da resposta informada (post_content)
	 * @date 2017-05-31
	 * */
	function gravidade_insonia_salvar( data_hora, questao, resposta ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE post_date=? "+
							"AND post_title=? "+
							"AND post_type='gravidade-insonia' "+
							"LIMIT 1 "
							, [data_hora, questao], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_content=? WHERE post_date=?', ['gravidade-insonia', questao, data_hora, resposta, data_hora]);
				}else{
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status, post_content) VALUES (?,?,?,?,?)', ['gravidade-insonia', questao, data_hora, 'publish', resposta]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO gravidade_insonia_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta gravidade_insonia_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}





	/**
	 * Adiciona/altera os dados das respostas para SONOLENCIA DIURNA
	 * @var data_hora informar data e hora no formato YYYY-MM-DD (post_date)
	 * @var questao informar o numero da questão (post_title)
	 * @var resposta informar o valor da resposta informada (post_content)
	 * @date 2017-05-31
	 * */
	function sonolencia_diurna_salvar( data_hora, questao, resposta ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE post_date=? "+
							"AND post_title=? "+
							"AND post_type='sonolencia-diurna' "+
							"LIMIT 1 "
							, [data_hora, questao], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_content=? WHERE post_date=?', ['sonolencia-diurna', questao, data_hora, resposta, data_hora]);
				}else{
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status, post_content) VALUES (?,?,?,?,?)', ['sonolencia-diurna', questao, data_hora, 'publish', resposta]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO sonolencia_diurna_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta sonolencia_diurna_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}




	/**
	 * Adiciona/altera os dados das respostas para QUALIDADE DO SONO
	 * @var data_hora informar data e hora no formato YYYY-MM-DD (post_date)
	 * @var questao informar o numero da questão (post_title)
	 * @var resposta informar o valor da resposta informada (post_content)
	 * @date 2017-05-31
	 * */
	function qualidade_sono_salvar( data_hora, questao, resposta ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE post_date=? "+
							"AND post_title=? "+
							"AND post_type='qualidade-sono' "+
							"LIMIT 1 "
							, [data_hora, questao], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_content=? WHERE post_date=?', ['qualidade-sono', questao, data_hora, resposta, data_hora]);
				}else{
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status, post_content) VALUES (?,?,?,?,?)', ['qualidade-sono', questao, data_hora, 'publish', resposta]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO qualidade_sono_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta qualidade_sono_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}





	/**
	 * Adiciona/altera os dados das respostas para APNEIA
	 * @var data_hora informar data e hora no formato YYYY-MM-DD (post_date)
	 * @var questao informar o numero da questão (post_title)
	 * @var resposta informar o valor da resposta informada (post_content)
	 * @date 2017-05-31
	 * */
	function apneia_salvar( data_hora, questao, resposta ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE post_date=? "+
							"AND post_title=? "+
							"AND post_type='apneia' "+
							"LIMIT 1 "
							, [data_hora, questao], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_content=? WHERE post_date=?', ['apneia', questao, data_hora, resposta, data_hora]);
				}else{
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status, post_content) VALUES (?,?,?,?,?)', ['apneia', questao, data_hora, 'publish', resposta]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO apneia_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta apneia_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}





	/**
	 * Adiciona/altera os dados das respostas para SOBRE O SONO
	 * @var data_hora informar data e hora no formato YYYY-MM-DD (post_date)
	 * @var questao informar o numero da questão (post_title)
	 * @var resposta informar o valor da resposta informada (post_content)
	 * @date 2017-05-29
	 * */
	function sobre_sono_salvar( data_hora, questao, resposta ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE post_date=? "+
							"AND post_title=? "+
							"AND post_type='sobre-o-sono' "+
							"LIMIT 1 "
							, [data_hora, questao], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade >= 1 ){
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_content=? WHERE post_date=?', ['sobre-o-sono', questao, data_hora, resposta, data_hora]);
				}else{
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status, post_content) VALUES (?,?,?,?,?)', ['sobre-o-sono', questao, data_hora, 'publish', resposta]);
				}
				
			}, 
			function(tx, res){
				console.log('ERRO sobre_sono_salvar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta sobre_sono_salvar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}
	
	
	





function echoTest() {
  window.sqlitePlugin.echoTest(function() {
    navigator.notification.alert('Echo test OK');
  }, function(error) {
    navigator.notification.alert('Echo test ERROR: ' + error.message);
  });
}

function selfTest() {
  window.sqlitePlugin.selfTest(function() {
    navigator.notification.alert('Self test OK');
  }, function(error) {
    navigator.notification.alert('Self test ERROR: ' + error.message);
  });
}

function reload() {
  location.reload();
}

function stringTest1() {
  database.transaction(function(transaction) {
    transaction.executeSql("SELECT upper('Test string') AS upperText", [], function(ignored, resultSet) {
      navigator.notification.alert('Got upperText result (ALL CAPS): ' + resultSet.rows.item(0).upperText);
    });
  }, function(error) {
    navigator.notification.alert('SELECT count error: ' + error.message);
  });
}

function stringTest2() {
  database.transaction(function(transaction) {
    transaction.executeSql('SELECT upper(?) AS upperText', ['Test string'], function(ignored, resultSet) {
      navigator.notification.alert('Got upperText result (ALL CAPS): ' + resultSet.rows.item(0).upperText);
    });
  }, function(error) {
    navigator.notification.alert('SELECT count error: ' + error.message);
  });
}

function showCount() {
  database.transaction(function(transaction) {
	  
    transaction.executeSql('SELECT count(*) AS recordCount FROM ds_options', [], function(ignored, resultSet) {
      navigator.notification.alert('ds_options COUNT: ' + resultSet.rows.item(0).recordCount);
    });
	
    transaction.executeSql('SELECT count(*) AS recordCount FROM ds_posts', [], function(ignored, resultSet) {
      navigator.notification.alert('ds_posts COUNT: ' + resultSet.rows.item(0).recordCount);
    });
	
  }, function(error) {
    navigator.notification.alert('SELECT count error: ' + error.message);
  });
}

function addRecord() {
  database.transaction(function(transaction) {
    transaction.executeSql('INSERT INTO ds_options VALUES (NULL, ?,?, datetime( "now","localtime") )', ['User '+nextUser, nextUser]);
  }, function(error) {
    navigator.notification.alert('INSERT error: ' + error.message);
  }, function() {
    navigator.notification.alert('INSERT OK');
    ++nextUser;
  });
}

function addJSONRecordsAfterDelay() {
  function getJSONObjectArray() {
    var COUNT = 100;
    var myArray = [];

    for (var i=0; i<COUNT; ++i) {
      myArray.push({name: 'User '+nextUser, score: nextUser});
      ++nextUser;
    }

    return myArray;
  }

  function getJSONAfterDelay() {
    var MY_DELAY = 150;

    var d = $.Deferred();

    setTimeout(function() {
      d.resolve(getJSONObjectArray());
    }, MY_DELAY);

    return $.when(d);
  }

  // NOTE: This is similar to the case when an application
  // fetches the data over AJAX to populate the database.
  // IMPORTANT: The application MUST get the data before
  // starting the transaction.
  //tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_status) VALUES (?,?,?)', ['atividades', 'Estudo', 'publish']);
  getJSONAfterDelay().then(function(jsonObjectArray) {
    database.transaction(function(transaction) {
      $.each(jsonObjectArray, function(index, recordValue) {
        transaction.executeSql('INSERT INTO ds_posts (post_title, post_content, post_status, post_type) VALUES (?,?,?,?)',
          [recordValue.name, recordValue.score, 'publish', 'diario' ]);
      });
    }, function(error) {
      navigator.notification.alert('ADD records after delay ERROR '+ error.message );
    }, function() {
      navigator.notification.alert('ADD 100 records after delay OK');
    });
  });
}

function deleteRecords() {
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM ds_posts');
    transaction.executeSql('DELETE FROM ds_options');
  }, function(error) {
    navigator.notification.alert('DELETE error: ' + error.message);
  }, function() {
    navigator.notification.alert('DELETE OK');
    ++nextUser;
  });
}


function deleteDatabase(){
	window.sqlitePlugin.deleteDatabase({name: "diariodosono.db", location: 'default'}, function(){
		navigator.notification.alert('SQLite: DATABASE DELETED');
	}, function( error ){
		navigator.notification.alert("DELETE error:  "+ error.code +" : "+ error.message );
	});
}

function nativeAlertTest() {
  navigator.notification.alert('Native alert test message');
}

function goToPage2() {
  window.location = "page2.html";
}

