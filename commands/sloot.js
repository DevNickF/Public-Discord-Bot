const { getRandomInt, theShuffler } = require( './helpers' );
let loopTimer;
module.exports = async function mySlootFunction( messagePassed, passedItemArgs, google ) 
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
				let loopCounter = 0;
				await clearPreviousMessages();
				// Set an interval to loop the 'sloot' scraper every 91 seconds
				loopTimer = setInterval( async () => {
					// If the loop counter exceeds 20, clear previous messages and reset the counter
					if ( loopCounter > 20 ) 
					{
						await clearPreviousMessages();
						loopCounter = 0;
					}
					// Call the 'sloot' scraper function
					await mySlootScraper( messagePassed, google );
					// Increment the loop counter
					loopCounter++;
				}, 91000 );
				break;
			/*case 'hub':
				// Initialize the Hub
				await clearPreviousMessages()
				await myHubScraper( messagePassed );
				break;*/
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
async function mySlootScraper( messagePassed, google ) 
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
		const imgResult = imageResults.find( ( result ) => { return !result.url.startsWith( 'https://cdn.' ) } );
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
}*/