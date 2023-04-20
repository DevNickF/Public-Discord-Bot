module.exports = function myClearFunction( messagePassed, passedItemArgs ) 
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