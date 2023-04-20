// Helper function to get random integer
function getRandomInt( max ) { return Math.floor( Math.random() * max ) + 1; }

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