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
