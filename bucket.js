function stringToByteArray( str ) {
    var codepoint, stack, bytes = [];

    for ( var i = 0; i < str.length; i++ ) {
        codepoint = str.charCodeAt( i );
        stack = [];
        do {
            // get 8 lowest bits of character
            stack.unshift( codepoint & 0xff );
        } while ( codepoint >>= 8 );
        bytes = bytes.concat( stack );
    }

    return bytes;
}

var mur3_32 = require( './mur3.js' ).mur3_32;

var UINT32_MAX = 0x100000000;

function inSimpleRandomSample( indiv, fraction ) {
    // equal probability of selection
    var sample = Math.floor( fraction * UINT32_MAX );
    var hash = [];

    if ( typeof indiv !== 'string' ) {
        throw new TypeError( [
            'inSimpleRandomSample():',
            'individual must be of type string',
            '(got: ' + typeof indiv + ')'
        ].join(' ') );
    }

    indiv = stringToByteArray( indiv ).join( '' );

    hash = mur3_32( indiv, 0 );

    return ( hash <= sample );
}

var in_sample = 0
var k = 1000000;
var frac = 0.5;
for ( var i = 0; i < k; i++ ) {
    if ( inSimpleRandomSample( i, frac ) ) {
        in_sample++;
    }
}

console.log( 0.5 - (in_sample / k) );
