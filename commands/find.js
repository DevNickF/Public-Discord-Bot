const { getRandomInt } = require( './helpers' );
module.exports = function myFindFunction( messagePassed, passedItemArgs, google ) 
{
	const rand = getRandomInt( 20 );
	// Find specific image or send a funny apple if no specific search is passed
	const searchQuery = passedItemArgs.length > 0 ? passedItemArgs + ' ' : 'apple funny';

	google.scrape( searchQuery, rand ).then( ( imageResults ) => {
		const randomImageUrl = imageResults[Math.floor( Math.random() * imageResults.length )].url;
		messagePassed.reply( randomImageUrl ); } )
    .catch( ( error ) => { messagePassed.channel.send( 'Failed... ' + passedItemArgs ); } );
}