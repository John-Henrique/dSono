$(function(){
	
	
	exportar = {
		
		enviar_email: true,
		
		
		init: function(){
			
		},
		
		
		setEnviarEmail: function( enviar ){
			this.enviar_email = enviar;
		},
		
		
		
		sql: function( strSQL, fileName, isAppend ){
			
			console.log( "Conteudo:");
			console.log( strSQL );
			
			
			if( ( fileName == '' ) || ( fileName == undefined )){
				fileName = parseInt( new Date().getMonth() + 1) +'-'+ new Date().getFullYear() +".txt";
			}
			
			if( ( isAppend == '' ) || ( isAppend == undefined )){
				isAppend = false; // sobrescrever
			}
			
			
			
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
				
				// iOS cordova.file.documentsDirectory
				// Android cordova.file.dataDirectory
				// estava usando cordova.file.externalRootDirectory e funciona no LG
				window.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, function (dirEntry) {
					
					console.log( "Acesso ao diretório concedido ");
					
					// Criando o diretório "Sincronize" para armazenar o arquivo
					fs.root.getDirectory( config.app_name, { create: true, exclusive: false }, function(){
						console.log( "Diretorio criado ");
					}, function(){
						console.log( "erro ao criar diretório "+ config.app_name );
					});
					//console.log( "Depois da criação do diretorio ");
					
					diretorioArquivo = config.app_name +"/"+ fileName;
					console.log( "depois da url "+ diretorioArquivo );
					
					// Creates a new file or returns the file if it already exists.
					dirEntry.getFile( diretorioArquivo, {create: true, exclusive: false}, function(fileEntry) {
						
						console.log( "acessando diretório "+ fileEntry );
						// Create a FileWriter object for our FileEntry (log.txt).
						fileEntry.createWriter(function (fileWriter){
							
							
							fileWriter.onwriteend = function(){
								//readFile(fileEntry);
								console.log( "Gerando arquivo do relatório");
								//anexo.arquivo();
								
								if( exportar.enviar_email ){
									//console.log( "Preparando email");
									exportar.email( fileEntry, fileName );
								}
							};

							fileWriter.onerror = function (e) {
								console.log("Failed file read: " + JSON.stringify( e ));
							};
							
							
							// If we are appending data to file, go to the end of the file.
							if( isAppend ) {
								try {
									console.log( "Escrevendo arquivo ");
									fileWriter.seek(fileWriter.length);
								}
								catch (e) {
									console.log("file doesn't exist! "+ e.toString());
								}
							}
							var blob = new Blob(["\r\n"+ strSQL ], {type: 'text/plain'});
							fileWriter.write(blob);
						});
						
					}, function(e){
						console.log( "não foi possivel criar o arquivo" );
						console.log( e.code );
						phonon.notif( "erro ao criar arquivo ", 3000, false );
					});
					
				}, function(e){
					phonon.notif( "ANEXO ERROR ao criar arquivo: "+ JSON.stringify( e ), 10000, true );
				});
				

			}, function(){
				alert( "erro permissão");
			});
		},
		
		
		email: function( fileEntry, diretorioArquivo ){
			//console.log( "Enviando email");
			anexo.upload( fileEntry, diretorioArquivo );
		}
	}
});