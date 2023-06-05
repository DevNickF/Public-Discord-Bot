module.exports = function myClearFunction( messagePassed, passedItemArgs ) {
	try {
		if ( passedItemArgs[0] === 'sender' ) 
		{
			// Delete all messages by a specific sender
			const senderName = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase( );
			messagePassed.channel.messages.fetch( ).then( ( messages ) => {
				const senderMessages = messages.filter( ( message ) =>
					message.author.username.toLowerCase( ) === senderName );

				let deletedCount = 0;
				senderMessages.forEach( ( message ) => {
					if ( isNewerThanTwoWeeks( message ) ) 
					{
						message.delete( )
						.then( ( ) => {
							deletedCount++;
							console.log( `Deleted message: ${message.content}` );
						} )
						.catch( ( error ) => {
							console.error( `Error deleting message: ${message.content}` );
							console.error( error );
						} );
					}
				} );

				messagePassed.channel.send( `Cleared ${deletedCount} messages by ${senderName}.` );
			} );
		} 
		else if ( passedItemArgs.length > 0 && !isNaN( passedItemArgs[0] ) ) 
		{
			// Delete specific number of messages
			const amount = parseInt( passedItemArgs[0] );
			if ( amount < 1 || amount > 99 ) { return messagePassed.reply( 'Enter a number between 1 and 99.' ); }

			messagePassed.channel.messages.fetch( ).then( ( messages ) => {
				const messagesArray = Array.from( messages.values( ) );
				const messagesToDelete = messagesArray.filter( ( message ) => isNewerThanTwoWeeks( message ) ).slice( 0, amount );
				messagePassed.channel.bulkDelete(messagesToDelete).then(() => { messagePassed.channel.send( `Cleared ${amount} messages.` ); } )
				.catch( ( error ) => { console.error( 'Error while deleting messages:', error ); } );
			});
		}
		else 
		{
			// If no number is passed, delete messages newer than 2 weeks
			messagePassed.channel.messages.fetch( ).then( ( messages ) => {
				const messagesToDelete = messages.filter( ( message ) => isNewerThanTwoWeeks( message ) );
				messagePassed.channel.bulkDelete( messagesToDelete ).then( ( ) => { messagePassed.channel.send( 'Cleared all messages newer than 2 weeks.' ); } );
			} );
		}
	} 
	catch ( error ) { messagePassed.channel.send( 'Clear Failed... ' ); }
};

function isNewerThanTwoWeeks( messagePassed02 ) 
{
	const twoWeeksAgo = new Date( ).getTime( ) - 14 * 24 * 60 * 60 * 1000;
	return messagePassed02.createdTimestamp > twoWeeksAgo;
}

/* module.exports = function myClearFunction( messagePassed, passedItemArgs ) 
{
	try {
		if ( passedItemArgs[0] === 'sender' ) 
		{
			// Delete all messages by a specific sender
			const senderName = passedItemArgs.slice( 1 ).join( ' ' ).toLowerCase( );
			messagePassed.channel.messages.fetch( ).then( ( messages ) => {
				const senderMessages = messages.filter( ( message ) => 
					message.author.username.toLowerCase( ) === senderName );
					messagePassed.channel.bulkDelete( senderMessages );
					messagePassed.channel.send( `Cleared all messages by ${senderName}.` ); } );
		} 
		else if ( passedItemArgs.length > 0 && !isNaN( passedItemArgs ) ) 
		{
			// Delete specific number of messages
			const amount = parseInt( passedItemArgs );
			if ( amount < 1 || amount > 99 ) { return messagePassed.reply( 'Enter a number between 1 and 99.' ); }
      
			messagePassed.channel.bulkDelete( amount + 1 ).then( ( ) => {
				messagePassed.channel.send( `Cleared ${amount} messages.` ); } );
		} 
		else // If no number is passed, delete 99 messages
		{
			messagePassed.channel.messages.fetch( { limit: 99 } ).then( ( messages ) => {
				messagePassed.channel.bulkDelete( messages ).then( ( ) => {
					messagePassed.channel.send( 'Cleared all messages.' ); } ); } );
		}
	} 
	catch ( error ) { messagePassed.channel.send( 'Clear Failed... ' ); }
} */