var database = null;
window.txtExportar = null;

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
			
			
			
			tabela = 
					'CREATE TABLE IF NOT EXISTS "ds_postmeta" ( '+
					'`meta_id`		INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, '+
					'`post_id`		INTEGER \'0\', '+
					'`meta_key`		TEXT, '+
					'`meta_value`	TEXT '+
					')';
				
			tx.executeSql( tabela, [], 
			function( tx, res ){
				//navigator.notification.alert( "tabela ds_postmeta criada" );
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO ds_postmeta '+ res.code +' '+ res.message  );
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
	 * @date 2017-05-28 00:00
	 * */
	function atividade_existe( data_hora, atividade ){
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE STRFTIME( '%Y-%m-%d %H:%M', post_date )=? "+
							"AND post_title=? "+
							"AND post_type='diario' "+
							"LIMIT 3 "
							, [data_hora, atividade], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				//console.log( quantidade +' '+ data_hora +' '+ atividade );
				sessao = ( sessionStorage.getItem( 'registros' ) == null )?0:sessionStorage.getItem( 'registros' );
				sessionStorage.setItem( 'registros', parseInt( parseInt( sessao ) + 1 ) );
				
				if( quantidade > 0 ){
					console.log( "Update "+ data_hora +' ID: '+ res.rows.item(0).ID );
					tx.executeSql('UPDATE ds_posts SET post_type=?, post_title=?, post_date=?, post_status=? WHERE post_date=?', ['diario', atividade, data_hora, 'publish', data_hora]);
				}else{
					
					//console.log( "INSERT "+ data_hora );
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
	 * Recupera a meta informada. Caso exista mais de 1 item com a mesma chave
	 * será retornado o valor da chave mais recente
	 * 
	 * @intPostId informar o Id do post (meta_id)
	 * @strMetaKey informar a chave (strMetaKey)
	 * @return retorna o valor da chave ou false
	 * */
	function get_post_meta( intPostId, strMetaKey, callBack, callBackError ){

		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT meta_value "+
							"FROM ds_postmeta "+
							"WHERE post_id = '"+ intPostId +"' "+
							"AND meta_key = '"+ strMetaKey +"' "+
							"ORDER BY meta_id DESC "+ 
							"LIMIT 1 "
							,[/*intPostId,strMetaKey*/], 
			function( tx, res ){
					
				
				valor = '';
				quantidade = res.rows.length;
				console.log( "get_post_meta QTD "+ quantidade );
				
				if( quantidade > 0 ){
					
					valor = res.rows.item( 0 ).meta_value;
					
					console.log( intPostId +' '+ strMetaKey +' = '+ valor );
					
					if( typeof( callBack ) == 'function' ){
						callBack( valor );
					}
				}else{
					
					if( typeof( callBackError ) == 'function' ){
						callBackError( "Nada encontrado em get_post_meta post_id "+ intPostId +" meta_key "+ strMetaKey +" meta_value "+ valor );
					}
				}
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO get_post_meta '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta get_post_meta "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}
	
	
	
	/*
	 * Recupera todas as metas do post informado. 
	 * 
	 * @intPostId informar o Id do post (meta_id)
	 * @return retorna um array com todas metas encontradas ou false em caso de não encontrar nada
	 * */
	function get_all_post_meta( intPostId, callBack, callBackError ){

		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT meta_value "+
							"FROM ds_postmeta "+
							"WHERE post_id = '"+ intPostId +"' "+
							"ORDER BY meta_id DESC "+ 
							"LIMIT 1 "
							,[/*intPostId,strMetaKey*/], 
			function( tx, res ){
					
				
				valor = '';
				quantidade = res.rows.length;
				console.log( "get_post_meta QTD "+ quantidade );
				
				if( quantidade > 0 ){
					
					valor = res.rows.item( 0 ).meta_value;
					
					console.log( intPostId +' '+ strMetaKey +' = '+ valor );
					
					if( typeof( callBack ) == 'function' ){
						callBack( valor );
					}
				}else{
					
					if( typeof( callBackError ) == 'function' ){
						callBackError( "Nada encontrado em get_post_meta post_id "+ intPostId +" meta_key "+ strMetaKey +" meta_value "+ valor );
					}
				}
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO get_post_meta '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta get_post_meta "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}
	
	
	/*
	 * Recupera a opção informada. Caso exista mais de 1 item com a mesma chave
	 * será retornado o valor da chave mais recente
	 * 
	 * @strOpcao informar a chave (option_name)
	 * @return retorna o valor da chave ou false
	 * */
	function get_option( strOpcao, callBack, callBackError ){

		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT option_value "+
							"FROM ds_options "+
							"WHERE option_name = '"+ strOpcao +"' "+
							"ORDER BY option_id DESC "+ 
							"LIMIT 1 "
							,[/*strOpcao*/], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				if( quantidade > 0 ){
					
					valor = res.rows.item( 0 ).option_value;
					
					console.log( strOpcao +' '+ valor );
					
					if( typeof( callBack ) == 'function' ){
						callBack( valor );
					}
					
				}else{
					if( typeof( callBackError ) == 'function' ){
						callBackError( "Nada encontrado em get_option "+ strOpcao );
					}
				}
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO get_option '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta get_option "+ erro.code +" : "+ erro.message );
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
				
				if( quantidade > 0 ){
					
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
	 * Verifica se o email do doutor foi adicionado
	 * @return Retorna o email do médico ou false se não existe
	 * */
	function perfil_doutor( ){

		email_medico = localStorage.getItem( 'email_medico' ) ;
		
		if( ( email_medico == undefined ) || ( email_medico == '' ) || ( email_medico == null )){
			
			database.transaction( function( tx ){
				
				tx.executeSql(  "SELECT option_name, option_value "+
								"FROM ds_options "+
								"WHERE option_name='email-medico' "+
								"AND option_value != '' "+
								"ORDER BY option_id ASC "+
								"LIMIT 1"
								,[], 
				function( tx, res ){
						
					quantidade = res.rows.length;
					
					phonon.notif( "email_doutor: "+ quantidade, 10000, false );
					
					if( quantidade > 0 ){
						phonon.notif( "email: "+ res.rows.item( 0 ).option_value, 10000, false );
						localStorage.setItem( 'email_medico', res.rows.item( 0 ).option_value );
						return res.rows.item( 0 ).option_value;
					}else{
						return false;
					}
				}, 
				function(tx, res){
					navigator.notification.alert( 'ERRO perfil_doutor '+ res.code +' '+ res.message );
				}); 
				
			}, function(erro){
				navigator.notification.alert("SQLite: consulta perfil_doutor "+ erro.code +" : "+ erro.message );
			}, function(){
				///navigator.notification.alert("SQLite: consulta realizada");
			});
		}else{
			return email_medico;
		}
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
				
				if( quantidade > 0 ){
					
					for( i=0; i < quantidade; i++ ){
						
						console.log( res.rows.item( i ).option_name +' '+ res.rows.item( i ).option_value );
						$( 'configuracoes input[name="'+ res.rows.item( i ).option_name +'"' ).val( res.rows.item( i ).option_value );
						
						if( res.rows.item(i).option_name == 'nome' ){
							localStorage.setItem( 'nome', res.rows.item(i).option_value );
						}
						
						if( res.rows.item(i).option_name == 'email' ){
							localStorage.setItem( 'nome', res.rows.item(i).option_value );
						}
					}
					
				}
			}, 
			function(tx, res){
				navigator.notification.alert( 'ERRO configuracoes_listar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta configuracoes_listar "+ erro.code +" : "+ erro.message );
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
		
		if( data ){
			data = data.substring( 0, 10 );
		}
		
		//console.log( "hoje é "+ getDia() );
		//console.log( "Data informada "+ data );
		
		database.transaction( function( tx ){
			
			tx.executeSql(  "SELECT ID, post_title, strftime( '%H%M', post_date ) AS hora1, STRFTIME( '%Y-%m-%d', post_date ) AS hora2, post_date "+
							"FROM ds_posts "+
							"WHERE STRFTIME( '%Y-%m-%d', post_date )= '"+ data +"' "+ 
							"AND post_type=? "+
							"ORDER BY post_date ASC "
							,['diario' ], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				//phonon.notif( "quantidade "+ quantidade +" "+ data, 3000, false );
				
				if( quantidade > 0 ){
					
					for( i=0; i < quantidade; i++ ){
						
						titulo = '';
						
						li = $( 'diario-atividade li[data-hora="hora-'+ res.rows.item( i ).hora1 +'"]' );
						
						// adiciona o icone
						li.find( 'a:first' ).removeClass( li.find( 'a:first' ).prop( 'class' ) ).addClass( 'pull-right icon icon-'+ res.rows.item( i ).post_title.replace( ' ', '-' ).replace( 'í', 'i' ) );
						//console.log( res.rows.item( i ).hora1 +' '+ res.rows.item( i ).post_title );
						
						if( res.rows.item( i ).post_title != " " ){
							// adiciona o nome da atividade
							//console.log( res.rows.item( i ).hora1 +" "+ res.rows.item( i ).post_title +' '+ typeof( res.rows.item( i ).post_title ) );
							
							titulo = '- '+ res.rows.item( i ).post_title;
						}
						
						li.find( 'a:last span' ).text( ' '+ titulo );
					}
					
				}else{
					// nada encontrado
					li = $( 'diario-atividade .horario li' );
					$.each( li, function( i, html ){
						elemento = $( html );
						elemento.find( 'a:first' ).removeClass( elemento.find( 'a:first' ).prop( 'class' ) ).addClass( 'pull-right icon' );
						elemento.find( 'a:last span' ).text( '' );
					});
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
	function gera_relatorios(){
		
		var email_medico = null;
		
		get_option( 'email-medico', function( email_medico ){
		
			console.log( email_medico +' '+ typeof( email_medico ) );
			
			localStorage.setItem( 'observacoes', $( '.observacoes' ).val() );
			
			
			if( ( email_medico != undefined ) && ( email_medico != '' ) ){
				localStorage.setItem( 'email_medico', email_medico );
				
				
				phonon.notif( "Email medico: "+ email_medico , 3000, false );
				
				gera_relatorio_apneia();
				gera_relatorio_sobre_sono();
				gera_relatorio_qualidade_sono();
				gera_relatorio_diario_atividade();
				gera_relatorio_gravidade_insonia();
				gera_relatorio_sonolencia_diurna();
				gera_relatorio_preferencia_diurna();
				
				
				//localStorage.removeItem( 'email_medico' );
				
			}else{
				phonon.notif( "Você precisa informar o email do médico, vá para Configurações. ", 10000, false );
			}
		}, function( erro ){
			phonon.notif( "Informe o email do médico.", 10000, false );
			setTimeout(function(){
				phonon.navigator().changePage( "configuracoes" );
				console.log( "mudando tela");
				window.location.href= "#!configuracoes";
			},8000);
		});
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
					
					exportar.sql( salvar, 'preferencia-diurna-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
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
					
					exportar.sql( salvar, 'gravidade-insonia-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
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
					
					exportar.sql( salvar, 'sonolencia-diurna-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
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
					
					exportar.sql( salvar, 'qualidade-sono-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
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
					
					exportar.sql( salvar, 'apneia-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
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
		window.txtExportar = 'DEITOU;LEVANTOU;AVALIA SONO; FACILIDADE PARA ADORMECER;FACILIDADE PARA ACORDAR; INICIO DO DIA; FIM DO DIA;ACORDOU DURANTE NOITE; ESPECIFIQUE; ACORDOU SOZINHO OU FOI ACORDADO; ESPECIFIQUE\r\n';
		
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID, post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['sobre-o-sono'], function(ignored, resultSet) { //
				
				qtdPost = resultSet.rows.length;
				console.log( "Sobre "+ qtdPost );
				
				for(i=0; i< qtdPost; i++){
					post_id = resultSet.rows.item( i ).ID;
					console.log( post_id );
					console.log( resultSet.rows.item( i ).post_date );
					
					
					
					transaction.executeSql('SELECT * FROM ds_postmeta WHERE post_id=?', [post_id], function(ignored, resultSet) {
						
						qtdPostmeta = resultSet.rows.length;
						
						console.log( "QTD postmeta "+ qtdPostmeta );
						
						for(o=1; o< qtdPostmeta; o++){
							
							//console.log( 'post_id '+ post_id +' questao-'+ o );
							window.txtExportar += resultSet.rows.item(o).meta_value +';';
							
							// sempre que chegarmos ao final da quantidade de metas
							if( o == qtdPostmeta ){
								window.txtExportar += '\r\n';
							}
						}
						
						
						
						salvar = dados;
						exportar.setEnviarEmail(true);
						
						d = new Date();
						
						console.log( window.txtExportar );
						//exportar.sql( salvar, 'sobre-sono-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
						exportar.sql( window.txtExportar, 'sobre-sono-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					});
				}
			});
			
			
				phonon.notif( "gera_relatorio_sobre_sono ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_sobre_sono error: ' + error.message);
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
				
				if( quantidade > 0 ){
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
				
				if( quantidade > 0 ){
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
				
				if( quantidade > 0 ){
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
				
				if( quantidade > 0 ){
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
				
				if( quantidade > 0 ){
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
				
				if( quantidade > 0 ){
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
				
				if( quantidade > 0 ){
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
	 * @var strDataHora informar data e hora no formato YYYY-MM-DD (post_date)
	 * @var strCpt informar o tipo de post CPT (post_content)
	 * @var strMetaKey informa a meta_key (meta_key)
	 * @var strMetaValue informa a meta_value (meta_value)
	 * @date 2017-07-08
	 **/
	function cpt_adicionar( strDataHora, strCpt, strMetaKey, strMetaValue ){
		
		database.transaction( function( tx ){
			
			/**
			 * Criar tratamento para separar data 
			 * da hora, assim posso adicionar a data 
			 * no post_title e usar no SELECT
			 * 2017-07-09 00:31:00
			 * fica
			 * 2017-07-09
			 **/
			strData = separaDia( strDataHora );
			/*
			console.log( "DATA "+ strData );
			console.log( "DATAHORA "+ strDataHora );
			console.log( "CPT "+ strCpt );
			*/
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE strftime('%Y-%m-%d', post_date)=? "+ // buscando apenas pela data sem hora
							//"AND post_title=? "+// só pode haver um questionário por dia
							"AND post_type=? "+
							"LIMIT 1 "
							, [strData, /*strDataHora, */strCpt], 
			function( tx, res ){
					
				quantidade = res.rows.length;
				
				/**
				 * Verificando se algum post foi encontrado
				 * Se nada foi encontrado iremos apenas 
				 * atualizar as metas
				 * */
				if( quantidade > 0 ){
					id = res.rows.item(0).ID
					
					console.log( "cpt_adicionar ID existente "+ id );
					add_post_meta( id, strMetaKey, strMetaValue );
				}else{
					// não existe, não temos ID e por isso vamos adicionar
					tx.executeSql('INSERT INTO ds_posts (post_type, post_title, post_date, post_status, post_content) VALUES (?,?,?,?,?)', [strCpt, strDataHora, strDataHora, 'publish', ' '], function(x, result){
						
						id = result.insertId;
						console.log( "cpt_adicionar ID "+ id );
						add_post_meta( id, strMetaKey, strMetaValue );
					});
				}
				
			}, 
			function(tx, res){
				console.log('ERRO cpt_adicionar '+ res.code +' '+ res.message );
			}); 
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta cpt_adicionar "+ erro.code +" : "+ erro.message );
		}, function(){
			///navigator.notification.alert("SQLite: consulta realizada");
		});
	}
	
	
	
	
	
	/**
	 * Adiciona uma meta no post informado
	 * @var intPostId informar o ID do post (post_id)
	 * @var strMetaKey informar a chave da meta (meta_key)
	 * @var strMetaValue informar o valor da meta (meta_value)
	 * @date 2017-07-09
	 * */
	function add_post_meta( intPostId, strMetaKey, strMetaValue ){
		
		database.transaction( function( tx ){
			
			//console.log( "PostID "+ intPostId +" MetaKey "+ strMetaKey +" MetaValue "+ strMetaValue );
			
			
			tx.executeSql(  "SELECT * "+
							"FROM ds_postmeta "+
							"WHERE post_id="+ intPostId +" "+
							"AND meta_key=? "+
							"AND meta_value=? "+
							"LIMIT 1 "
							, [/*intPostId,*/ strMetaKey, strMetaValue], 
			function( tx, res ){
				
				quantidade = res.rows.length;
				console.log( "meta retornada "+ quantidade );
				
				for( i=0; i < quantidade; i++ ){
					
					meta_id = res.rows.item(i).meta_id;
					post_id = res.rows.item(i).post_id;
					meta_key = res.rows.item(i).meta_key;
					meta_value = res.rows.item(i).meta_value;
					/*
					console.log( "Meta ID "+ meta_id );
					console.log( "Meta post_id "+ post_id );
					console.log( "Meta meta_key "+ meta_key );
					console.log( "Meta meta_value "+ meta_value );
					 * */
				}
				
					
				if( quantidade > 0 ){
					tx.executeSql('UPDATE ds_postmeta SET meta_value=? WHERE meta_id=?', [strMetaValue, meta_id ], 
					function( tx, res3 ){
						console.log('OK UPDATE add_post_meta '+ meta_id +' '+ strMetaKey +' '+ strMetaValue );
					}, 
					function(tx, res4){
						console.log('ERRO UPDATE add_post_meta  '+ meta_id +' '+ strMetaKey +' '+ strMetaValue );
						console.log('ERRO UPDATE add_post_meta '+ meta_id +' '+ res4.code +' '+ res4.message );
						console.log('----' );
					}); 
				}else{
					tx.executeSql('INSERT INTO ds_postmeta (post_id, meta_key, meta_value) VALUES (?,?,?)', [intPostId, strMetaKey, strMetaValue], 
					function( tx, res1 ){
						console.log('OK INSERT add_post_meta '+ res1.insertId +' '+ strMetaKey +' '+ strMetaValue );
					}, 
					function(tx, res2){
						console.log('ERRO INSERT add_post_meta '+ strMetaKey +' '+ strMetaValue );
						console.log('ERRO INSERT add_post_meta '+ res2.code +' '+ res2.message );
						console.log('----' );
					}); 
				}
				
			}, 
			function(tx, res5){
				console.log('ERRO add_post_meta '+ res5.code +' '+ res5.message );
			}); 
			
			
		}, function(erro){
			navigator.notification.alert("SQLite: consulta add_post_meta "+ erro.code +" : "+ erro.message );
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
				
				if( quantidade > 0 ){
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
	
    transaction.executeSql('SELECT count(*) AS recordCount FROM ds_postmeta', [], function(ignored, resultSet) {
      navigator.notification.alert('ds_postmeta COUNT: ' + resultSet.rows.item(0).recordCount);
    });
	
	data = sessionStorage.getItem( 'data' );//AND STRFTIME( "%Y-%m-%d", post_date )="'+ data +'
    transaction.executeSql('SELECT * FROM ds_posts WHERE post_type="diario" ORDER BY post_date ASC ', [], function(ignored, res) {
		quantidade = res.rows.length;
		if( quantidade > 0 ){
			
			html = '';
			
			for( i=0; i < quantidade; i++ ){
				
				html = html +"<li>"+ res.rows.item( i ).post_date +' '+ res.rows.item( i ).post_title +"</li>";
			}
			
			$( '.registros' ).html( html );
		}
		
    });
	
    transaction.executeSql('SELECT * FROM ds_postmeta ORDER BY meta_id ASC ', [], function(ignored, res) {
		quantidade = res.rows.length;
		if( quantidade > 0 ){
			
			html = '';
			
			for( i=0; i < quantidade; i++ ){
				
				html = html +"<li>meta_key: "+ res.rows.item( i ).meta_key +" meta_value: "+ res.rows.item( i ).meta_value +" meta_id: "+ res.rows.item( i ).meta_id +" post_id: "+ res.rows.item( i ).post_id +"</li>";
			}
			
			$( '.registros' ).html( html );
		}
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
    transaction.executeSql('DELETE FROM ds_postmeta');
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

