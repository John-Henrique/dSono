var database = null;
var txtExportar = {};

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
	
	/*
	 * Recupera a meta informada. Caso exista mais de 1 item com a mesma chave
	 * será retornado o valor da chave mais recente
	 * 
	 * @intPostId informar o Id do post (meta_id)
	 * @strMetaKey informar a chave (strMetaKey)
	 * @return retorna o valor da chave ou false
	 * */
	function get_post_meta( intPostId, strMetaKey, callBack, callBackError ){

		return database.transaction( function( tx ){
			
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
					}else{
						return valor;
					}
					
				}else{
					
					if( typeof( callBackError ) == 'function' ){
						callBackError( "Nada encontrado em get_post_meta post_id "+ intPostId +" meta_key "+ strMetaKey +" meta_value "+ valor );
					}else{
						return "nada encontrado";
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
	 * @strArrayKey informar uma chave para identificar no array txtExportar
	 * @return retorna um array com todas metas encontradas ou false em caso de não encontrar nada
	 * */
	function get_all_post_meta( arrPostIds, strArrayKey, callBack, callBackError ){
		
		console.log( "get_all_post_meta" );
		//console.log( arrPostIds );
		console.log( strArrayKey );
		
		$.each( arrPostIds, function(index, intPostId ){
			
			database.transaction( function( tx ){
				
				tx.executeSql(  "SELECT meta_id, meta_value, meta_key "+
								"FROM ds_postmeta "+
								"WHERE post_id = '"+ intPostId +"' "+
								"ORDER BY meta_id ASC "
								,[/*intPostId,strMetaKey*/], 
				function( tx, res ){
						
					valor = '';
					quantidade = res.rows.length;
					if( quantidade > 0 ){
						
						/**
						 * Percorrendo todos os itens encontrados
						 * */
						for( i=0; i < quantidade; i++ ){
							
							valor 		= res.rows.item( i ).meta_value;
							strMetaKey 	= res.rows.item( i ).meta_key;
							
							console.log( intPostId +' '+ strMetaKey +' = '+ valor );

							objeto = {};
							objeto[strMetaKey] = valor;
							
							if( typeof( callBack ) == 'function' ){
								callBack( strArrayKey, valor );
								//callBack( strArrayKey, objeto );
							}else{
								console.log( "Não é uma função");
								
								console.log( typeof( callBack ));
							}
						
						}
						
					}
					
					
					if( typeof( callBackError ) == 'function' ){
						callBackError( "Nada encontrado em get_post_meta post_id "+ intPostId +" meta_key "+ strMetaKey +" meta_value "+ valor );
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
			
		});// fim $.each
		
	}
	
	
	
	function exportar_dados( strArrayKey, strValue ){
		
		txtExportar = JSON.parse( sessionStorage.getItem( 'strArrayKey' ) );
		
		/**
		 * Verificando se a chave informada 
		 * existe e se esta chave não é 
		 * um item não definido
		 * */
		if( ( txtExportar == null ) || ( typeof( txtExportar ) == 'undefined' ) || ( typeof( txtExportar ) == 'string' ) ){
			txtExportar = {};
		}
		
		if( ( typeof( txtExportar[strArrayKey] ) == 'undefined' ) || ( typeof( txtExportar[strArrayKey] ) == '' ) ){
			// criando um array
			txtExportar[strArrayKey] = [];
		}
		
		
		txtExportar[strArrayKey].push( strValue );
		
		//console.log( txtExportar);
		sessionStorage.setItem( 'strArrayKey', JSON.stringify( txtExportar ) );
		
		/**
		console.log( strArrayKey );
		console.log( strValue );
		console.log( typeof( txtExportar ) );
		console.log( txtExportar );
		 * */
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
						
						post_id = res.rows.item(i).ID;
						
						tx.executeSql('SELECT * , STRFTIME( "%H%M", meta_value ) AS meta_value1 FROM ds_postmeta WHERE post_id=? ORDER BY meta_id ASC', [post_id], function(ignored, res) {
							
							qtdPostmeta = res.rows.length;
							console.log( "QTD postmeta "+ qtdPostmeta );
							
							for(o=0; o< qtdPostmeta; o++){
								/*
								//console.log( 'post_id '+ post_id +' questao-'+ o );
								console.log( "key "+ res.rows.item(o).meta_key );
								console.log( "value "+ res.rows.item(o).meta_value );
								console.log( "value1 "+ res.rows.item(o).meta_value1 );
								 * */
								//window.txtExportar += resultSet.rows.item(o).meta_value +';';
								meta_key = res.rows.item( o ).meta_key.replace( ':', '' )
								meta_value = res.rows.item( o ).meta_value.replace( ' ', '-' ).replace( 'í', 'i' );
								/*
								console.log( meta_value );
								console.log( meta_key );
								*/
								titulo = '';
								
								li = $( 'diario-atividade li[data-hora="hora-'+ meta_key +'"]' );
								
								// adiciona o icone
								li.find( 'a:first' ).removeClass( li.find( 'a:first' ).prop( 'class' ) ).addClass( 'pull-right icon icon-'+ meta_value );
								//console.log( res.rows.item( o ).hora1 +' '+ res.rows.item( o ).post_title );
								
								if( res.rows.item( o ).meta_key != " " ){
									// adiciona o nome da atividade
									//console.log( res.rows.item( o ).hora1 +" "+ res.rows.item( o ).post_title +' '+ typeof( res.rows.item( o ).post_title ) );
									
									titulo = '- '+ res.rows.item( o ).meta_value;
								}
								
								li.find( 'a:last span' ).text( ' '+ titulo );
								
								
							}
						});
						
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
				
				
				//phonon.notif( "Email medico: "+ email_medico , 3000, false );
				
				// executando funções separadamente
				/*
				relatorios(
					gera_relatorio_apneia(get_all_post_meta,exportar_dados),
					gera_relatorio_sobre_sono(get_all_post_meta,exportar_dados),
					gera_relatorio_qualidade_sono(get_all_post_meta,exportar_dados),
					gera_relatorio_diario_atividade(get_all_post_meta,exportar_dados),
					gera_relatorio_gravidade_insonia(get_all_post_meta,exportar_dados),
					gera_relatorio_sonolencia_diurna(get_all_post_meta,exportar_dados),
					gera_relatorio_preferencia_diurna(get_all_post_meta,exportar_dados)
				)
				*/
				gera_relatorio_apneia_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("gera_relatorio_apneia");
						console.log('1');
					}, 100);
				}).promise();
				
				gera_relatorio_sobre_sono_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("gera_relatorio_sobre_sono");
						console.log('2');
					}, 200);
				}).promise();
				
				gera_relatorio_qualidade_sono_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("gera_relatorio_qualidade_sono");
						console.log('3');
					}, 300);
				}).promise();
				
				gera_relatorio_diario_atividade_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("gera_relatorio_diario_atividade");
						console.log('4');
					}, 400);
				}).promise();
				
				gera_relatorio_gravidade_insonia_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("gera_relatorio_gravidade_insonia");
						console.log('5');
					}, 500);
				}).promise();
				
				gera_relatorio_sonolencia_diurna_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("gera_relatorio_sonolencia_diurna");
						console.log('6');
					}, 600);
				}).promise();
				
				gera_relatorio_preferencia_diurna_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("gera_relatorio_preferencia_diurna");
						console.log('7');
					}, 700);
				}).promise();
				
				envia_relatorio_fn = $.Deferred(function(def){
					setTimeout( function(){
						def.resolve("envia_relatorio_fn");
						console.log('8');
					}, 1500);
				}).promise();
				
				
				
				gera_relatorio_apneia_fn.done(function( data ){
					gera_relatorio_apneia(get_all_post_meta,exportar_dados);
				});
				
				gera_relatorio_sobre_sono_fn.done(function(){
					gera_relatorio_sobre_sono(get_all_post_meta,exportar_dados);
				});
				
				gera_relatorio_qualidade_sono_fn.done(function(){
					gera_relatorio_qualidade_sono(get_all_post_meta,exportar_dados);
				});
				
				gera_relatorio_diario_atividade_fn.done(function(){
					gera_relatorio_diario_atividade(get_all_post_meta,exportar_dados);
				});
				
				gera_relatorio_gravidade_insonia_fn.done(function(){
					gera_relatorio_gravidade_insonia(get_all_post_meta,exportar_dados);
				});
				
				gera_relatorio_sonolencia_diurna_fn.done(function(){
					gera_relatorio_sonolencia_diurna(get_all_post_meta,exportar_dados);
				});
				
				gera_relatorio_preferencia_diurna_fn.done(function(){
					gera_relatorio_preferencia_diurna(get_all_post_meta,exportar_dados);
				});
				
				envia_relatorio_fn.done(function(){
					envia_relatorio();
				});
				
				$.when(
					gera_relatorio_apneia_fn,
					gera_relatorio_sobre_sono_fn,
					gera_relatorio_qualidade_sono_fn,
					gera_relatorio_diario_atividade_fn,
					gera_relatorio_gravidade_insonia_fn,
					gera_relatorio_sonolencia_diurna_fn,
					gera_relatorio_preferencia_diurna_fn,
					envia_relatorio_fn
				).done(function( teste ){
					console.log( "Tudo pronto");
				});
				
			}else{
				phonon.notif( "Você precisa informar o email do médico, vá para Configurações. ", 10000, false );
			}
		}, function( erro ){
			notif = phonon.notif( "Informe o email do médico.", 5000, false );
			notif.setColor( 'negative' );
			
			setTimeout(function(){
				phonon.navigator().changePage( "configuracoes" );
				console.log( "mudando tela");
				window.location.href= "#!configuracoes";
			},1000);
		});
	}
	
	
	/**
	 * Callback para executar os processos 
	 * individualmente, um a um e evitar 
	 * falhas de concorrência
	 * 
	 * @since 2017-08-19
	 * */
	function relatorios(){
		for( i=0; i < arguments.length; i++ ){
			
			// se argumento for uma função
			if( typeof( arguments[i] ) == 'function' ){
				console.log( arguments[i].toString() );
				arguments[i];
			}
		}
	}
	
	
	function envia_relatorio(){
		
		salvar 	= dados;
		d 		= new Date();
		mes 	= (d.getMonth()+1) +'-'+ d.getFullYear();
		
		
		arrArquivos = [];
		arrArquivos.push( {nome:'apneia-'+ mes, chave:'apneia', qtd:10 } );
		arrArquivos.push( {nome:'diario-'+ mes, chave:'diarioatividade', qtd:48 } );
		arrArquivos.push( {nome:'gravidade-insonia-'+ mes, chave:'gravidadeinsonia', qtd:10 } );
		arrArquivos.push( {nome:'preferencia-diurna-'+ mes, chave:'preferenciadiurna', qtd:10 } );
		arrArquivos.push( {nome:'qualidade-sono-'+ mes, chave:'qualidadesono', qtd:10 } );
		arrArquivos.push( {nome:'sobre-sono-'+ mes, chave:'sobresono', qtd:10 } );
		arrArquivos.push( {nome:'sonolencia-diurna-'+ mes, chave:'sonolenciadiurna', qtd:10 } );
		
		
		// todos os dados do relatório
		dados = JSON.parse( sessionStorage.getItem( 'strArrayKey' ) );
		
		console.log( "envia relatorio" );
		console.log( dados );
		
		//anexo.arquivo( arrArquivos );
		$.each( dados, function(i, arquivo){
			
			//arquivo.nome
			console.log( i );
			console.log( arquivo );
			
			exportar.sql( delimitador( arquivo, i ), i +'-'+ mes +'.txt', false );
		});
		
	}
	
	
	
	/**
	 * Retorna os limites de elementos para cada chave
	 * isto será utilizado para limitar a quantidade 
	 * de elementos em cada linha do relatório
	 * 
	 * @var strChave string com a chave a identificar o limite
	 * */
	function limites( strChave ){
		dados = {};
		
		switch( strChave ){
			case "apneia":
				dados['header'] = 'ddddd\r\n';
				dados['limite'] = 10;
				return dados;
				break;
				
			case "diarioatividade":
				dados['header'] = 'DATA/HORA;00:00;00:30;01:00;01:30;02:00;02:30;03:00;03:30;04:00;04:30;05:00;05:30;06:00;06:30;07:00;07:30;08:00;08:30;09:00;09:30;10:00;10:30;11:00;11:30;12:00;12:30;13:00;13:30;14:00;14:30;15:00;15:30;16:00;16:30;17:00;17:30;18:00;18:30;19:00;19:30;20:00;20:30;21:00;21:30;22:00;22:30;23:00;23:30\r\n';
				dados['limite'] = 48;
				return dados;
				break;
				
			case "gravidadeinsonia":
				dados['header'] = 'sssss\r\n';
				dados['limite'] = 7;
				return dados;
				break;
				
			case "preferenciadiurna":
				dados['header'] = 'dddd\r\n';
				dados['limite'] = 19;
				return dados;
				break;
				
			case "qualidadesono":
				dados['header'] = 'dddd\r\n';
				dados['limite'] = 26;
				return dados;
				break;
				
			case "sobresono":
				dados['header'] = 'DEITOU;LEVANTOU;AVALIA SONO; FACILIDADE PARA ADORMECER;FACILIDADE PARA ACORDAR; INICIO DO DIA; FIM DO DIA;ACORDOU DURANTE NOITE; ESPECIFIQUE; ACORDOU SOZINHO OU FOI ACORDADO; ESPECIFIQUE\r\n';
				dados['limite'] = 11;
				return dados;
				break;
				
			case "sonolenciadiurna":
				dados['header'] = 'dddd\r\n';
				dados['limite'] = 8;
				return dados;
				break;
			
			default:
				dados['header'] = 'NENHUMA CHAVE ENCONTRADA\r\n';
				dados['limite'] = 10;
				return dados;
		}
	}
	
	
	/**
	 * Limita a quantidade de itens por linha 
	 * automaticamente separa os itens existentes 
	 * 
	 * @var objDados array com os dados do relatório
	 * @var strNomeArquivo nome do arquivo a ser criado
	 * */
	function delimitador( objDados, strNomeArquivo ){
		limite = limites( strNomeArquivo );
		temp = limite.header;
		iTemp = 1;
		console.log( strNomeArquivo +' limite em '+ limite.limite );
		
		$.each( objDados, function( i, valor ){
			
			//console.log( iTemp );
			if( iTemp == limite.limite ){
				temp += valor +';\r\n';
				
				iTemp = 1;
			}else{
				temp += valor +';';
				iTemp ++;
			}
		});
		
		return temp;
	}
	
	/**
	 * Gera relatório do preferencia diurna
	 * */
	function gera_relatorio_preferencia_diurna(callback,callbackExportar){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			//console.log( callback2);
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID, post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY ID, post_date ASC", ['preferencia-diurna'], function(ignored, resultSet) { //
				//console.log( callback);
				
				
				preferenciaDiurnaIDs = [];
				for(i=0; i<resultSet.rows.length; i++){
					//console.log( resultSet.rows.item( i ).ID );

					post_id = resultSet.rows.item( i ).ID;
					preferenciaDiurnaIDs.push( post_id ); // array com todos os IDs de preferência diurna
				}
				
				
				if( typeof(callback) == 'function' ){
					console.log("======");
					console.log( "Callback gera_relatorio_preferencia_diurna" );
					console.log( preferenciaDiurnaIDs );
					callback(preferenciaDiurnaIDs, 'preferenciadiurna', callbackExportar );
					console.log("======");
					
				}else{
					console.log( "callback não é uma função");
					console.log( typeof(callback));
				}
				
					/*
					salvar = dadosPreferenciaDiurna;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, 'preferencia-diurna-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					*/
				
			});
			
			
				//phonon.notif( "gera_relatorio_preferencia_diurna ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_preferencia_diurna error: ' + error.message);
		});
		
	}
	




	/**
	 * Gera relatório do gravidade insonia
	 * */
	function gera_relatorio_gravidade_insonia(callback,callbackExportar){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['gravidade-insonia'], function(ignored, resultSet) { //
				
				gravidadeInsoniaIDs = [];
				for(i=0; i<resultSet.rows.length; i++){
					
					post_id  = resultSet.rows.item( i ).ID;

					gravidadeInsoniaIDs.push( post_id ); // array com todos os IDs de preferência diurna
				}
				
				
				if( typeof(callback) == 'function' ){
					console.log("======");
					console.log( "Callback gera_relatorio_gravidade_insonia" );
					console.log( gravidadeInsoniaIDs );
					callback(gravidadeInsoniaIDs, 'gravidadeinsonia', callbackExportar );
					console.log("======");
					
				}else{
					console.log( "callback não é uma função");
					console.log( typeof(callback));
				}
				
				
				/*
				salvar = dados;
				exportar.setEnviarEmail(true);
				
				d = new Date();
				
				exportar.sql( salvar, 'gravidade-insonia-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
				//console.log( salvar );
				*/
				
			});
			
			
				//phonon.notif( "gera_relatorio_gravidade_insonia ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_gravidade_insonia error: ' + error.message);
		});
		
	}
	



	/**
	 * Gera relatório do sonolencia diurna
	 * */
	function gera_relatorio_sonolencia_diurna(callback,callbackExportar){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID, post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['sonolencia-diurna'], function(ignored, resultSet) { //
				
				sonolenciaDiurnaIDs = [];
				for(i=0; i<resultSet.rows.length; i++){

					post_id = resultSet.rows.item( i ).ID;
					sonolenciaDiurnaIDs.push( post_id ); // array com todos os IDs de preferência diurna
				}
				
				
				if( typeof(callback) == 'function' ){
					console.log("======");
					console.log( "Callback gera_relatorio_sonolencia_diurna" );
					console.log( sonolenciaDiurnaIDs );
					callback(sonolenciaDiurnaIDs, 'sonolenciadiurna', callbackExportar );
					console.log("======");
					
				}else{
					console.log( "callback não é uma função");
					console.log( typeof(callback));
				}
				
				
				
				/*
				salvar = dados;
				exportar.setEnviarEmail(true);
				
				d = new Date();
				
				//console.log( window.txtExportar );
				console.log( sessionStorage.getItem( 'sonolencia-diurna' ) );
				//exportar.sql( salvar, 'sobre-sono-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
				exportar.sql( sessionStorage.getItem( 'sonolencia-diurna' ), 'sonolencia-diurna-'+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
				 **/
			});
			
			
				//phonon.notif( "gera_relatorio_sonolencia_diurna ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_sonolencia_diurna error: ' + error.message);
		});
		
	}
	


	/**
	 * Gera relatório do qualidade sono
	 * */
	function gera_relatorio_qualidade_sono(callback,callbackExportar){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID, post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['qualidade-sono'], function(ignored, resultSet) { //
				
				dados	= '';
				
				
				qtdPost = resultSet.rows.length;
				qualidadeSonoIDs = [];
				for(i=0; i< qtdPost; i++){
					post_id = resultSet.rows.item( i ).ID;
					
					qualidadeSonoIDs.push( post_id ); // array com todos os IDs de preferência diurna
				}
				
				
				if( typeof(callback) == 'function' ){
					console.log("======");
					console.log( "Callback gera_relatorio_qualidade_sono" );
					console.log( qualidadeSonoIDs );
					callback(qualidadeSonoIDs, 'qualidadesono', callbackExportar );
					console.log("======");
					
				}else{
					console.log( "callback não é uma função");
					console.log( typeof(callback));
				}
				
				
			});
			
			
				//phonon.notif( "gera_relatorio_qualidade_sono ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_qualidade_sono error: ' + error.message);
		});
		
	}
	


	/**
	 * Gera relatório do apneia
	 * @revisado 2017-08-08
	 * @status funcionando como esperado
	 * */
	function gera_relatorio_apneia(callback,callbackExportar){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID, post_date, post_content, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['apneia'], function(ignored, resultSet) { //
				
				dados	= '';
				apneiaIDs = [];
				for(i=0; i<resultSet.rows.length; i++){
					/*
					console.log( resultSet.rows.item( i ).post_content );
					dados  = dados + resultSet.rows.item( i ).post_content +';';
					
					if( ( parseInt(i+1)%11) == 0 ){
						dados = dados +"\r\n";
					}
					 * */
					post_id = resultSet.rows.item( i ).ID;
					apneiaIDs.push( post_id ); // array com todos os IDs de preferência diurna
				}
				
				
				if( typeof(callback) == 'function' ){
					console.log("======");
					console.log( "Callback gera_relatorio_apneia" );
					console.log( apneiaIDs );
					callback(apneiaIDs, 'apneia', callbackExportar );
					console.log("======");
					
				}else{
					console.log( "callback não é uma função");
					console.log( typeof(callback));
				}
				
				
			});
			
			
				//phonon.notif( "gera_relatorio_apneia ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_apneia error: ' + error.message);
		});
		
	}
	
	
	
	/**
	 * Gera relatório do sobre o sono
	 * */
	function gera_relatorio_sobre_sono(callback, callbackExportar){
		var salvar = '';
		dados = '';
		window.txtExportar = 'DEITOU;LEVANTOU;AVALIA SONO; FACILIDADE PARA ADORMECER;FACILIDADE PARA ACORDAR; INICIO DO DIA; FIM DO DIA;ACORDOU DURANTE NOITE; ESPECIFIQUE; ACORDOU SOZINHO OU FOI ACORDADO; ESPECIFIQUE\r\n';
		
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID, post_date, strftime('%H:%M', post_date) AS hora FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['sobre-o-sono'], function(ignored, resultSet) { //
				
				qtdPost = resultSet.rows.length;
				//console.log( "Sobre "+ qtdPost );
				sobreSonoIDs = [];
				for(i=0; i< qtdPost; i++){
					post_id = resultSet.rows.item( i ).ID;
					 
					sobreSonoIDs.push( post_id ); // array com todos os IDs de preferência diurna
				}
				
				
				if( typeof(callback) == 'function' ){
					console.log("======");
					console.log( "Callback gera_relatorio_sobre_sono" );
					console.log( sobreSonoIDs );
					callback(sobreSonoIDs, 'sobresono', callbackExportar );
					console.log("======");
					
				}else{
					console.log( "callback não é uma função");
					console.log( typeof(callback));
				}
				
			});
			
			
				//phonon.notif( "gera_relatorio_sobre_sono ", 3000, false );
				
		}, function(error) {
			navigator.notification.alert('SELECT gera_relatorio_sobre_sono error: ' + error.message);
		});
		
	}
	
	




	/**
	 * Gera relatório do diário de atividades
	 * */
	function gera_relatorio_diario_atividade(callback,callbackExportar){
		var salvar = '';
		dados = '';
		
		database.transaction(function(transaction) {
			
			/*
			 * Roda somente a hora 
			 * */
			transaction.executeSql( "SELECT ID FROM ds_posts WHERE post_type=? ORDER BY post_date ASC", ['diario'], function(ignored, resultSet) { //
				
				dados	= 'DATA/HORA;';
				diarioAtividadeIDs = [];
				for(i=0; i<resultSet.rows.length; i++){
					
					post_id = resultSet.rows.item( i ).ID;
					diarioAtividadeIDs.push( post_id ); // array com todos os IDs de preferência diurna
				}
				
				
				if( typeof(callback) == 'function' ){
					console.log("======");
					console.log( "Callback gera_relatorio_diario_atividade" );
					console.log( diarioAtividadeIDs );
					callback(diarioAtividadeIDs, 'diarioatividade', callbackExportar );
					console.log("======");
					
				}else{
					console.log( "callback não é uma função");
					console.log( typeof(callback));
				}
				/*
					
					salvar = dados;
					exportar.setEnviarEmail(true);
					
					d = new Date();
					
					exportar.sql( salvar, "atividades-"+ (d.getMonth()+1) +'-'+ d.getFullYear() +'.txt', false );
					//console.log( salvar );
					
				});*/
				
			});
			
			
			
			
			
			
				//phonon.notif( "gera_relatorio_diario_atividade ", 3000, false );
				
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
			
			console.log( "DATA "+ strData );
			console.log( "DATAHORA "+ strDataHora );
			console.log( "CPT "+ strCpt );
			
			tx.executeSql(  "SELECT ID "+
							"FROM ds_posts "+
							"WHERE strftime('%Y-%m-%d', post_date)=? "+
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
							//"AND meta_value=? "+ // não deve ser verificado o valor, se não iremos duplicar quando editar uma opção
							"LIMIT 1 "
							, [/*intPostId,*/ strMetaKey/*, strMetaValue*/], 
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

function deleteRecordsFromCpt( cpt ) {
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM ds_posts WHERE post_type=?', [cpt] );
  }, function(error) {
    navigator.notification.alert('DELETE error: ' + error.message);
  }, function() {
    navigator.notification.alert('DELETE '+ cpt +' OK');
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

