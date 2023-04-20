let dirPath = 'C:/Games';
let fileName = 'myReadFile.txt';
let readLoopTime = 30;
let lastNonEmptyLine = '';
let preLastNonEmptyLine = '';
let readTimer;
let readTimerRepeat;

module.exports = async function myReadFunction( messagePassed, passedItemArgs, botSettings, fs ) 
{
	try {
		// Read the bot settings file and split the string by line
		const settingsString = fs.readFileSync( botSettings, 'utf-8' );
		const settingsArray = settingsString.split( '\n' );
		let filePath = `${dirPath}/${fileName}`;
		let readStream = fs.createReadStream( filePath, { autoClose: true } );
		let newLines = '';
		// Loop through the settings array and update the variables based on the settings
		for ( let i = 0; i < settingsArray.length; i++ ) 
		{
    		const botSetting = settingsArray[i].split( ': ' );
    		switch ( botSetting[0].toLowerCase() ) 
    		{
        		// Update the directory path
        		case 'path':
            		if ( botSetting[1].includes( ' ' ) && !botSetting[1].includes( '"' ) ) { botSetting[1] = '"' + botSetting[1] + '"'; }
            		dirPath =  botSetting[1];
            		if ( !fs.existsSync( dirPath ) ) 
            		{ 
                		messagePassed.channel.send( `Cannot find the read directory:  ${dirPath}` ); 
                		messagePassed.channel.send( 'If the directory or folder contains spaces include "C:/My Folder" quotes' );
                		messagePassed.channel.send( 'Read directory location reset:  C:/Games' );
                		dirPath = 'C:/Games';
            		}
            		break;
        		// Update the file name
        		case 'file':
            		if ( botSetting[1].indexOf( ' ' ) === -1 ) { fileName = botSetting[1]; }
            		else { messagePassed.channel.send( 'File name cannot contain spaces!' ); }
            		break;
        		// Update the read loop time
        		case 'time':
            		readLoopTime = botSetting[1];
            		if ( readLoopTime < 30 || readLoopTime > 300 ) { readLoopTime = 30; }
            		break;
        		default:
            		break;
    		}
		}
		switch ( passedItemArgs[0] ) 
		{		
			// Start reading messages from file
			case 'start':
				clearInterval( readTimer );
				clearInterval( readTimerRepeat );
				// Check if file exists before creating it
				if ( fs.existsSync( filePath ) ) { messagePassed.channel.send( `File exists at: ${filePath}` ); } 
				else 
				{
					if ( !fs.existsSync( dirPath ) ) { fs.mkdirSync( dirPath ); }
					fs.writeFileSync( filePath, '' ); // create an empty file
					messagePassed.channel.send( `File created at: ${filePath}` );
				}
				// Set up interval to check for new messages in file
				readTimer = setInterval( async () => {
					readStream = fs.createReadStream( filePath, { autoClose: true } );
					readStream.on( 'data', ( line ) => { newLines += line.toString(); } );
					readStream.on( 'end', () => {
						const lines = newLines.split( '\n' ).filter( l => l.trim() !== '' );
    					if ( lines.length > 0 ) 
						{
      						lastNonEmptyLine = lines[lines.length - 1]; // Store the last non-empty line
      						if ( lastNonEmptyLine !== preLastNonEmptyLine ) 
							{
								preLastNonEmptyLine = lastNonEmptyLine; // Update previousLine with lastNonEmptyLine
								messagePassed.channel.send( lastNonEmptyLine ); // console.log( lastNonEmptyLine );
							}
    					} 
						newLines = ''; // Clear the buffer
					} );
				}, readLoopTime * 1000 );
				break;
			case 'repeat':
				clearInterval( readTimer );
				clearInterval( readTimerRepeat );
				// Check if file exists before creating it
				if ( fs.existsSync( filePath ) ) { messagePassed.channel.send( `File exists at: ${filePath}` ); } 
				else 
				{
					fs.writeFileSync( filePath, '' ); // create an empty file
					messagePassed.channel.send( `File created at: ${filePath}` );
				}
				// Set up interval to check for new messages in file
				readTimerRepeat = setInterval( async () => {	
					readStream = fs.createReadStream( filePath, { autoClose: true } );
					readStream.on( 'data', ( line ) => { newLines += line.toString(); } );
			  
					readStream.on( 'end', () => {
						const lines = newLines.split( '\n' ).filter( l => l.trim() !== '' );
						if ( lines.length > 0 ) 
						{
							lastNonEmptyLine = lines[lines.length - 1]; // Store the last non-empty line
							messagePassed.channel.send( lastNonEmptyLine ); // console.log( lastNonEmptyLine );
						} 
						newLines = '';
					} );
				}, readLoopTime * 1000 );
				break;
			// Stop reading messages from file
			case 'stop':
				clearInterval( readTimer );
				clearInterval( readTimerRepeat );
				readStream.destroy(); // Close the stream
				messagePassed.channel.send( 'Read stopped.' );
				break;
			// Set the read loop time
			case 'time':
				const senderTime = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase();
				const senderTimeInt = parseInt( senderTime );
				if ( senderTimeInt < 30 || senderTimeInt > 300 ) { return messagePassed.reply( 'Enter a number between 30 seconds and 300 seconds.' ); }
				readLoopTime = senderTimeInt;
				fs.readFile( botSettings, 'utf8', function ( error, data ) {
					if ( error ) throw error;
					const lines = data.split( '\n' );
					for ( let i = 0; i < lines.length; i++ ) 
					{
					  const setting = lines[i].split( ':' );
					  if ( setting[0].toLowerCase() === 'time' ) { lines[i] = `Time: ${readLoopTime}`; }
					}
					const updatedSettings = lines.join( '\n' );
					fs.writeFile( botSettings, updatedSettings, function ( error ) {
					  	if ( error ) throw error;
					  	console.log( 'Time updated in bot settings file.'); } ); } );
				messagePassed.channel.send( `Read loop time set to: ${readLoopTime}` );
				break;
			// Set the file name
			case 'file':
				fileName = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase();
				fs.readFile( botSettings, 'utf8', function ( error, data ) {
					if ( error ) throw error;

					const lines = data.split( '\n' );
					for ( let i = 0; i < lines.length; i++ ) 
					{
					  const setting = lines[i].split( ':' );
					  if ( setting[0].toLowerCase() === 'file' ) { lines[i] = `File: ${fileName}`; }
					}

					const updatedSettings = lines.join( '\n' );
					fs.writeFile( botSettings, updatedSettings, function ( error ) {
					  	if ( error ) throw error;
					  	console.log( 'File updated in bot settings file.' ); } ); } );
				messagePassed.channel.send( `File name set to: ${fileName}, found at ${filePath}` );
				break;
			// Set the directory path
			case 'folder':	
				let dirPathHolder = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase();
				let filePathHolder = `${dirPathHolder}/${fileName}`; 
				if( fs.existsSync( dirPathHolder ) ) 
				{ 
					if( fs.existsSync( filePathHolder ) )
					{
						fs.rename( filePathHolder, filePath, ( error ) => {
							if ( error ) throw error;
							console.log( 'File moved successfully!' ); } );
						messagePassed.channel.send( `Directory path set to: ${dirPathHolder} and ${fileName} moved to ${filePathHolder}` );
					}
					else { messagePassed.channel.send( `Directory path set to: ${dirPathHolder}` ); }	
					dirPath = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase();
					
					fs.readFile( botSettings, 'utf8', function ( error, data ) {
						if ( error ) throw error;

						const lines = data.split( '\n' );
						for ( let i = 0; i < lines.length; i++ ) 
						{
						  	const setting = lines[i].split( ':' );
						  	if ( setting[0].toLowerCase() === 'folder' ) { lines[i] = `Folder: ${dirPath}`; }
						}

						const updatedSettings = lines.join( '\n' );
						fs.writeFile( botSettings, updatedSettings, function ( error ) {
							if ( error ) throw error;
							console.log( 'File updated in bot settings file.' ); } ); } );
				}	
				else { messagePassed.channel.send( `Directory path set back to: ${dirPath}` ); }
				break;
			// Set default values for variables
			case 'reset':
				dirPath = 'C:/Games';
				fileName = 'myReadFile.txt';
				filePath = `${dirPath}/${fileName}`;
				readLoopTime = 30;
				break;
			// Send values of variables to discord
			case 'settings':
				messagePassed.channel.send( `Directory path is set to: ${dirPath}` );
				messagePassed.channel.send( `File name is set to: ${fileName}` );
				messagePassed.channel.send( `Loop time is set to: ${readLoopTime}` );
				break;
			// Send help message if unknown command
			default:
				messagePassed.reply( 'For additional information say "Example" followed by any command\ne.g. `Example Read' );
				break;
		}
	} 
	catch ( error ) { messagePassed.channel.send( 'Read Failed... ' ); }
}