const discord = require( 'discord.js' );
require( 'dotenv' ).config();
const client = new discord.Client( { restTimeOffset: 0, intents: ['GUILDS', 'GUILD_MESSAGES'] } );
const fs = require( 'fs' );
client.commands = new discord.Collection();
const myFindFunction = require( './commands/find' );
const myReadFunction = require( './commands/read' );
const myClearFunction = require( './commands/clear' );
const myExampleFunction = require( './commands/example' );
const mySlootFunction = require( './commands/sloot' );
const prefix = '`';
const scraper = require( 'images-scraper' );
const google = new scraper( { puppeteer: { headless: true } } );
const botSettings = 'publicBot.ini';

// Discord bot setup
client.once( 'ready', () => { 
	console.log( 'publicBot Online...' ); 
	// If the settings file does not exist, create it
	if ( !fs.existsSync( botSettings ) ) { fs.writeFileSync( botSettings, 'Path: C:/Games\nFile: myReadFile.txt\nTime: 30' ); }
} );  
client.login( process.env.DISCORD_TOKEN );

// Handle bot commands
client.on( 'messageCreate', message => {
	// Check if message is from bot or doesn't start with prefix
    if ( !message.content.startsWith( prefix ) || message.author.bot ) return;

	// Parse command and arguments
    const itemArgs = message.content.slice( prefix.length ).split( / +/ );
    const itemCommand = itemArgs.shift().toLowerCase();
	// Call appropriate function based on command
	switch ( itemCommand ) 
	{
		case 'find':
			myFindFunction( message, itemArgs, google );
			break;
		case 'read':
			myReadFunction( message, itemArgs, botSettings, fs );
			break;
		case 'clear':
			myClearFunction( message, itemArgs );
			break;
		case 'example':
			myExampleFunction( message, itemArgs );
			break;
		case 'sloot':
			mySlootFunction( message, itemArgs, google );
			break;	
		default:
			// Send help message if unknown command
			message.reply( 'The bot commands are:\nFind,  Read, and  Clear\nFor additional information say "Example" followed by any command\ne.g. `Example Find' );
			break;
	}
} );

/*
// Helper function to get random integer
function getRandomInt( max ) { return Math.floor( Math.random() * max ); }

// Helper function to randomize array
function theShuffler( array ) 
{
	for ( let currentIndex = array.length - 1; currentIndex > 0; currentIndex-- ) 
	{
	  	const swapIndex = Math.floor( Math.random() * ( currentIndex + 1 ) );
	  	[array[currentIndex], array[swapIndex]] = [array[swapIndex], array[currentIndex]];
	}
}

module.exports = { getRandomInt, theShuffler };

// Function to find an image from google and send them to the Discord channel
function myFindFunction( messagePassed, passedItemArgs ) 
{
	const rand = getRandomInt( 20 );
	// Find specific image or send a funny apple if no specific search is passed
	const searchQuery = passedItemArgs.length > 0 ? passedItemArgs + ' ' : 'apple funny';

	google.scrape( searchQuery, rand ).then( ( imageResults ) => {
		const randomImageUrl = imageResults[Math.floor( Math.random() * imageResults.length )].url;
		messagePassed.reply( randomImageUrl ); } )
    .catch( ( error ) => { messagePassed.channel.send( 'Failed... ' + passedItemArgs ); } );
}

// Function to read messages from a file and send them to the Discord channel
async function myReadFunction( messagePassed, passedItemArgs ) 
{
	try {
		const settingsString = fs.readFileSync( botSettings, 'utf-8' );
		const settingsArray = settingsString.split( '\n' );
		let filePath = `${dirPath}/${fileName}`;
		let readStream = fs.createReadStream( filePath, { autoClose: true } );
		let newLines = '';
		for ( let i = 0; i < settingsArray.length; i++ ) 
		{
			const botSetting = settingsArray[i].split( ': ' );
			switch ( botSetting[0].toLowerCase() ) 
			{
			  	case 'path':
					if ( botSetting[1].includes( ' ' ) ) { botSetting[1] = `"${botSetting[1]}"`; }
					dirPath = path.normalize( botSetting[1] );
					if ( !fs.existsSync( dirPath ) ) 
					{ 
						messagePassed.channel.send( `Cannot find the read directory:  ${dirPath}` ); 
						messagePassed.channel.send( 'If the directory or folder contains spaces include "C:/My Folder" quotes' );
						messagePassed.channel.send( 'Read directory location reset:  C:/Games' );
						dirPath = 'C:/Games';
					}
					break;
			  	case 'file':
					if ( botSetting[1].indexOf( ' ' ) === -1 ) { fileName = botSetting[1]; }
					else { messagePassed.channel.send( 'File name cannot contain spaces!' ); }
					break;
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
			case 'time':
				const senderTime = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase();
				const senderTimeInt = parseInt( senderTime );
				if ( senderTimeInt < 30 || senderTimeInt > 300 ) { return messagePassed.reply( 'Enter a number between 30 seconds and 300 seconds.' ); }
				readLoopTime = senderTimeInt;
				fs.readFileSync( botSettings, 'utf8', function ( error, data ) {
					if ( error ) throw error;
					
					const lines = data.split( '\n' );
					for ( let i = 0; i < lines.length; i++ ) 
					{
					  const setting = lines[i].split( ':' );
					  if ( setting[0].toLowerCase() === 'time' ) { lines[i] = `Time: ${readLoopTime}`; }
					}

					const updatedSettings = lines.join( '\n' );
					fs.writeFileSync( botSettings, updatedSettings, function ( error ) {
					  	if ( error ) throw error;
					  	console.log( 'Time updated in bot settings file.' ); } ); } );
				messagePassed.channel.send( `Read loop time set to: ${readLoopTime}` );
				break;
			case 'file':
				fileName = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase();
				fs.readFileSync( botSettings, 'utf8', function ( error, data ) {
					if ( error ) throw error;

					const lines = data.split( '\n' );
					for ( let i = 0; i < lines.length; i++ ) 
					{
					  const setting = lines[i].split( ':' );
					  if ( setting[0].toLowerCase() === 'file' ) { lines[i] = `File: ${fileName}`; }
					}

					const updatedSettings = lines.join( '\n' );
					fs.writeFileSync( botSettings, updatedSettings, function ( error ) {
					  	if ( error ) throw error;
					  	console.log( 'File updated in bot settings file.' ); } ); } );
				messagePassed.channel.send( `File name set to: ${fileName}, found at ${filePath}` );
				break;
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
					
					fs.readFileSync( botSettings, 'utf8', function ( error, data ) {
						if ( error ) throw error;

						const lines = data.split( '\n' );
						for ( let i = 0; i < lines.length; i++ ) 
						{
						  	const setting = lines[i].split( ':' );
						  	if ( setting[0].toLowerCase() === 'folder' ) { lines[i] = `Folder: ${dirPath}`; }
						}

						const updatedSettings = lines.join( '\n' );
						fs.writeFileSync( botSettings, updatedSettings, function ( error ) {
							if ( error ) throw error;
							console.log( 'File updated in bot settings file.' ); } ); } );
				}	
				else { messagePassed.channel.send( `Directory path set back to: ${dirPath}` ); }
				break;
			case 'reset':
				dirPath = 'C:/Games';
				fileName = 'myReadFile.txt';
				filePath = `${dirPath}/${fileName}`;
				readLoopTime = 30;
				break;
			default:
				messagePassed.reply( 'For additional information say "Example" followed by any command\ne.g. `Example Read' );
				break;
		}
	} 
	catch ( error ) { messagePassed.channel.send( 'Read Failed... ' ); }
}

// Function to clear messages from the Discord channel
function myClearFunction( messagePassed, passedItemArgs ) 
{
	try {
		if ( passedItemArgs[0] === 'sender' ) 
		{
			// Delete all messages by a specific sender
			const senderName = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase();
			messagePassed.channel.messages.fetch().then( ( messages ) => {
				const senderMessages = messages.filter( ( message ) => 
					message.author.username.toLowerCase() === senderName );
					messagePassed.channel.bulkDelete( senderMessages );
					messagePassed.channel.send( `Cleared all messages by ${senderName}.` ); } );
		} 
		else if ( passedItemArgs.length > 0 && !isNaN( passedItemArgs ) ) 
		{
			// Delete specific number of messages
			const amount = parseInt( passedItemArgs );
			if ( amount < 1 || amount > 99 ) { return messagePassed.reply( 'Enter a number between 1 and 99.' ); }
      
			messagePassed.channel.bulkDelete( amount + 1 ).then( () => {
				messagePassed.channel.send( `Cleared ${amount} messages.` ); } );
		} 
		else // If no number is passed, delete 99 messages
		{
			messagePassed.channel.messages.fetch( { limit: 99 } ).then( ( messages ) => {
				messagePassed.channel.bulkDelete( messages ).then( () => {
					messagePassed.channel.send( 'Cleared all messages.' ); } ); } );
		}
	} 
	catch ( error ) { messagePassed.channel.send( 'Clear Failed... ' ); }
}

// Function to give additional information about the bot commands
function myExampleFunction( messagePassed, passedItemArgs ) 
{
	try {
		switch ( passedItemArgs[0] ) 
		{
			case 'find':
				messagePassed.channel.send( 'The command  `Find  will search for a picture of an Apple.' );
				messagePassed.channel.send( 'The command  `Find Cat  will search for a picture of a Cat.' );
				messagePassed.channel.send( 'You can search for any image with the `Find command.' );
				break;
			case 'read':
				messagePassed.channel.send( 'The command  `Read Start  will start reading from a file and post each line to discord without repeating any duplicate message.' ); 
				messagePassed.channel.send( 'The command  `Read Repeat  will start reading from a file and post each line to discord repeatedly send the last line to discord.' );
				messagePassed.channel.send( 'The command  `Read Stop  will stop the bot from reading the file and stop sending messages to discord.' );
				messagePassed.channel.send( 'The command  `Read Time 180  will set the loop time to three minutes.' );
				messagePassed.channel.send( 'The time can be set between 30 seconds and 300 seconds.' );
				messagePassed.channel.send( 'The command  `Read File HelloWorld  will create a new file with the name HelloWorld.txt and read from there.' );
				messagePassed.channel.send( 'The old read file if it exists will no longer be used.' );
				messagePassed.channel.send( 'The command  `Read Folder C:/FolderName  will allow you to change the location of where your read file is stored.' );
				messagePassed.channel.send( 'Also moves the read file if it exists.' );
				messagePassed.channel.send( 'The command  `Read Reset  will return all modified settings back to default values.' );
				messagePassed.channel.send( 'Only one read bot can be active at a time.' );
				break;
			case 'clear':
				messagePassed.channel.send( 'The command  `Clear Sender Name  will delete up to 99 messages.' ); 
				messagePassed.channel.send( 'The command  `Clear 10  will delete 10 messages from anyone.' );
				messagePassed.channel.send( 'The command  `Clear  will bulk delete up to 99 messages from anyone.' );
				messagePassed.channel.send( 'Messages older than two weeks will not be detected and will not be deleted.' );
				break;
			case 'sloot':
				messagePassed.channel.send( 'The command  `Sloot Start  will start searching google for gifs and post one to discord every 90 seconds.' ); 
				messagePassed.channel.send( 'The command  `Sloot Stop  will stop the bot from searching google and sending messages to discord.' );
				messagePassed.channel.send( 'Only one sloot bot can be active at a time.' );
				break;	
			default:
				// Send help message if unknown command
				messagePassed.reply( 'The bot commands are:\nFind,  Read, and  Clear\nFor additional information say "Example" followed by any command\ne.g. `Example Find' );
				break;
		}
	} 
	catch ( error ) { messagePassed.channel.send( 'Example Failed... ' ); }
}

// Function to sloot images from google and send them to the Discord channel
async function mySlootFunction( messagePassed, passedItemArgs ) 
{
	try {
		const clearPreviousMessages = async () => {
			// Fetch last message and delete it
			const messages = await messagePassed.channel.messages.fetch( { limit: 99 } );
			await messagePassed.channel.bulkDelete( messages );
			// Send message indicating previous messages were cleared
			await messagePassed.channel.send( 'Nom, Nom, Nom...' ); };
		// Call appropriate function based on givven argument
		switch ( passedItemArgs[0] ) 
		{
			// Switch statement to handle different cases
			case 'start':
				clearInterval( loopTimer );
				// Initialize loop counter
				let x = 0;
				await clearPreviousMessages();
				// Set an interval to loop the 'sloot' scraper every 91 seconds
				loopTimer = setInterval( async () => {
					// If the loop counter exceeds 20, clear previous messages and reset the counter
					if ( x > 20 ) 
					{
						await clearPreviousMessages();
						x = 0;
					}
					// Call the 'sloot' scraper function
					await mySlootScraper( messagePassed );
					// Increment the loop counter
					x++;
				}, 91000 );
				break;
			//case 'hub':
				// Initialize the Hub
				//await clearPreviousMessages()
				//await myHubScraper( messagePassed );
				//break;
			case 'stop':
				// Stop the interval timer and clear previous messages
				clearInterval( loopTimer );
				await clearPreviousMessages();
				break;
			default:
				// If passedItemArgs is not 'start' or 'clear', reply with instructions
				messagePassed.reply( 'For additional information say "Example" followed by any command\ne.g. `Example Sloot' );
				break;
		}
	}
	catch ( error ) { messagePassed.channel.send( 'Sloot Failed... ' ); }
}

const starz = [
  '1', '2', '3',
];

const extraOne = [
  '1', '2', '3',
];

const extraTwo = [
	'1', '2', '3',
];

// Function to scrape for sloot images
async function mySlootScraper( messagePassed ) 
{
	// Generate random numbers and mix up the arrays
	const rand = getRandomInt( starz.length );
	const rand2 = getRandomInt( extraOne.length );
	const rand3 = getRandomInt( extraTwo.length );
	const rand4 = getRandomInt( 60 );
	theShuffler( starz );
	theShuffler( extraOne );
	theShuffler( extraTwo );

	try {
		// Search Google for images with query
		const imageResults = await google.scrape( `${starz[rand]} ${extraOne[rand2]} ${extraTwo[rand3]} gif`, rand4 );
		// Find the first image result that doesn't start with any of these domains
		const imgResult = imageResults.find( ( result ) => { return !result.url.startsWith( 'https://cdn.' ); } );
		// If there is an image result, send the image and a message about the search terms
		if ( imgResult ) 
		{
			messagePassed.channel.send( imgResult.url );
			messagePassed.channel.send( `I found this... ${starz[rand]}, ${extraOne[rand2]}` );
		} 
		// If no image result is found, call the function recursively
		else { mySlootScraper( messagePassed ); }
	} 
	// If there is an error, send an error message with the search terms
	catch ( error ) { messagePassed.channel.send( `Failed... ${starz[rand]}, ${extraOne[rand2]}, ${x}` ); }
}
*/

/*
const axios = require( 'axios' );
const cheerio = require( 'cheerio' );

async function myHubScraper( messagePassed ) 
{
	const url = 'https://www.google.com/';
	// Make a GET request to the URL using Axios
	axios.get( url ).then( response => {
		// Load the response HTML into Cheerio for parsing
		const $ = cheerio.load( response.data );
		// Find all image elements on the page using Cheerio selectors
		const images = $( 'img' ); // console.log( images + ' hello' );
		
		// Loop through each image element and extraOnect the source URL
		images.each( ( index, element ) => {
			if ( imageCount >= 5 ) { return false; } // Exit loop if 5 images have been posted
            const imageUrl = $( element ).attr( 'data-src' );  // src
            if ( imageUrl ) // Check image URL
            {
                //console.log( imageUrl + ' hello 2' );
				// Send the image URL to Discord
				messagePassed.channel.send( imageUrl );
                imageCount++; // Increment counter
            }
		} );
    } )
    .catch( error => { console.log( error ); } );
}
*/