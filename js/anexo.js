$(function(){
	
	anexo = {
		
		strTexto:0,
		
		
		init: function(){
			
			
			$( document ).on( 'click', '.enviar-relatorio', function(){
				
				phonon.notif( "Enviando relatório", 10000, false );
				
				/**
				 * Só iremos executar um relatório se sessionStorage.relatorio 
				 * não existir ou for diferente de 1
				 **/
				if( sessionStorage.getItem('relatorio') != 1 ){
					
						
						// indica que um relatório está em execução
						sessionStorage.setItem( 'relatorio', 1 );
						gera_relatios();
						phonon.notif( "Enviando relatório", 5000, true );
						
				}
			});
			
			
			anexo.usuario();
			
		},
		
		
		setStrTexto: function( strTexto ){
			this.strTexto = strTexto;
		},
		
		
		getStrTexto: function(){
			return this.strTexto;
		},
		
		usuario: function(){
			$( '.nome' ).val( localStorage.getItem( 'cadastro' ) );
			$( '.email' ).val( localStorage.getItem( 'cadastro' ) );
		},
		
		
		cria_relatorio: function(){
			//exportar.sql( strSQL, '', false );
			anexo.cria_arquivo();
		},
		
		
		cria_arquivo: function(){
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
				
				window.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, function (dirEntry) {
					
					
					// Criando o diretório "Sincronize" para armazenar o arquivo
					fs.root.getDirectory( 'Sincronize', { create: true, exclusive: false }, function(){
						////$( '.relatorio' ).html( "Diretorio Sincronize criado <BR>"+ $( '.relatorio' ).html( ) );
					}, function(){
						alert( "erro ao criar diretório Sincronize");
					});
					
					//coletor.falha( "CriaArquivo OK ");
					//$( '.status' ).html( JSON.stringify( dirEntry ) );
					var isAppend = false; // Não deve incrementar arquivo, sempre deve reescrever
					anexo.createFile(dirEntry, "Sincronize/relatorio-actograma-"+ parseInt( new Date().getMonth() + 1) + new Date().getFullYear() +".txt", isAppend);
				}, function(e){
					phonon.notif( "ANEXO ERROR ao criar arquivo: "+ JSON.stringify( e ), 10000, true );
				});
				

			}, function(){
				alert( "erro permissão");
			});
		},
		
		
		
		createFile:function(dirEntry, fileName, isAppend) {
			
			// Creates a new file or returns the file if it already exists.
			dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
				
				getRelatorioFisico();
				getRelatorioFisico();
				
				//coletor.falha( "createFile ok "+ teste );
				
				anexo.writeFile(fileEntry, anexo.getStrTexto(), isAppend);
				
			}, function(){
				alert( "erro ao criar arquivo");
			});
		},
		
		
		
		
		writeFile: function(fileEntry, dataObj, isAppend) {
			
			// Create a FileWriter object for our FileEntry (log.txt).
			fileEntry.createWriter(function (fileWriter) {
				
				
				fileWriter.onwriteend = function() {
					//$( '.relatorio' ).html("Successful file write...<BR>"+ $( '.relatorio' ).html() );
					//readFile(fileEntry);
					//coletor.falha( "WriteFile OK ");
					anexo.arquivo();
				};

				fileWriter.onerror = function (e) {
					coletor.falha("Failed file read: " + JSON.stringify( e ));
				};
				
				
				// If we are appending data to file, go to the end of the file.
				if( isAppend ) {
					try {
						fileWriter.seek(fileWriter.length);
					}
					catch (e) {
						coletor.falha("file doesn't exist! "+ e.toString());
					}
				}
				var blob = new Blob(["\r\n"+ dataObj], {type: 'text/plain'});
				fileWriter.write(blob);
			});
		},
		
		
		
		/**
		 * Localiza o arquivo de relatório
		 **/
		arquivo: function(){
			
			
			document.addEventListener( 'deviceready', function(){
				
				phonon.preloader( '.circle-progress' ).show();
				
				
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
					
					//window.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, function (dirEntry) {
					//dirEntry = cordova.file.externalRootDirectory;
					dirEntry = fs.root;
					
					dirEntry.getFile( "Sincronize/relatorio-actograma-"+ parseInt( new Date().getMonth() + 1) + new Date().getFullYear() +".txt", { create: true, exclusive: false }, function (fileEntry){
						
						
						//$( '.status' ).html( JSON.stringify( dirEntry.nativeURL +"Sincronize/relatorio-actograma-"+ parseInt( new Date().getMonth() + 1) +".txt" ) );
						//$( '.status' ).html( "Acesso do arquivo "+ JSON.stringify( fileEntry ) );
						
						//$( '.arquivo' ).val( dirEntry.nativeURL +"Sincronize/relatorio-actograma-"+ parseInt( new Date().getMonth() + 1) +".txt" );
						
						anexo.upload( fileEntry, cordova.file.externalRootDirectory +"Sincronize/relatorio-actograma-"+ parseInt( new Date().getMonth() + 1) + new Date().getFullYear() +".txt" );
						
					}, function(e){
						alert( "erro ao localizar arquivo "+ JSON.stringify( e ) );
					});
					
				
				}, function(){
					alert( "erro permissão");
					phonon.preloader( '.circle-progress' ).hide();
				});
			}, false );
		
		},
		
		
		upload: function(fileEntry, arquivoURL ) {
			// !! Assumes variable fileURL contains a valid URL to a text file on the device,
			//var fileURL = fileEntry.toURL();
			//var fileURL = arquivoURL;
			var fileURL = cordova.file.externalRootDirectory + config.app_name +"/"+ arquivoURL;
			
			var success = function (r) {
				//phonon.notif( "Relatório Actograma enviado", 10000, false );
				
				//$( '.status' ).html( "Successful upload...<BR>Code "+ r.responseCode +" bytes "+ r.bytesSent );
				phonon.preloader( '.circle-progress' ).hide();
			}
			
			
			//https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file-transfer/#filetransfererror
			var fail = function (error){
				
				switch( error.code ){
					case 1:
						texto = "Arquivo não encontrado";
						break;
					
					case 2:
						texto = "URL inválida";
						break;
						
					case 3:
						texto = "Falha na conexão";
						break;
						
					case 4:
						texto = "Ação abortada";
						break;
						
					case 5:
						texto = "Nada foi modificado";
						break;
					
					default:
						texto = "Erro desconhecido";
				}
				
				navigator.notification.alert( texto +" "+ JSON.stringify( error ) );
				
				//$( '.status' ).html( JSON.stringify( error ) );
				
				phonon.preloader( '.circle-progress' ).hide();
			}
			
			var options = new FileUploadOptions();
			options.fileKey 	= "arquivos[]";
			options.fileName 	= fileURL.substr(fileURL.lastIndexOf('/') + 1);
			options.mimeType 	= "text/plain";
			options.chunkedMode = false;
			
			var params = {};
			params.usuario_nome 	= $( '.nome' ).val();
			params.usuario_email 	= $( '.email' ).val();
			
			options.params 			= params;
			
			var ft = new FileTransfer();
			
			ft.onprogress = function(progressEvent){
				
				
				if(progressEvent.lengthComputable){
					//loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
					porcentagem = Math.floor(progressEvent.loaded / progressEvent.total * 100) +'%';
					
					$( '.spinner' ).text( porcentagem );
				}else{
					//loadingStatus.increment();
					$( '.spinner' ).text( porcentagem );
				}
			};
			
			// SERVER must be a URL that can handle the request, like
			url = config.api() +"/v1/upload";
			ft.upload(fileURL, encodeURI( url ), success, fail, options);
		},
		
		
		
		alvo: function(){
			
		},
		
		
		enviar: function(){
			
			phonon.preloader( '.circle-progress' ).show();
			
			url = config.api() +"/v1/upload-relatorio";
			
			$.ajax({
				url: url, 
				method: 'POST', 
				timeout: 30000,
				data: {
					app: config.app_name, 
				}
				
			}).done(function(retorno){
				
				// o servidor precisa responder com um texto
				contato.n( "Mensagem enviada", 10000 );
				
				$( '.arquivo' ).val('');
				
				
				phonon.alert( "Relatório enviado com sucesso", "Mensagem recebida", null, null );
				
				phonon.preloader( '.circle-progress' ).hide();
				
				
			}).fail(function( jxhr, status, statusText ){
				
				if( status === "timeout" ){
					contato.n( 'O servidor não está respondendo neste momento, tente novamente mais tarde.' );
				}
				
				
				if( jxhr.status == 404 || statusText == 'Not Found' ){ 
					contato.n( JSON.parse( jxhr.responseText ).message );
				}
				
				
				phonon.preloader( '.circle-progress' ).hide();
			});
		}
	}
});