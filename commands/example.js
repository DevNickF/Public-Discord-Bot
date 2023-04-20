module.exports = function myExampleFunction( messagePassed, passedItemArgs ) 
{
	try {
		switch ( passedItemArgs[0] ) 
		{
			case 'find':
				messagePassed.channel.send( 'The command  `Find  will search for a picture of an Apple.' );
				messagePassed.channel.send( 'The command  `Find Two Cats  will search for a picture of Two Cats.' );
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
				messagePassed.channel.send( 'The command  `Read Settings  will send all read settings to discord.' );
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