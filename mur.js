/*jslint white:true, vars:true, bitwise:true, plusplus:true */

function murmur3( key, seed ) {
    "use strict";

    var i = 0;
    var f = 0;
    var hi;
    var lo;

    var h1 = seed || 0;
    var k1 = 0;
    var codepoint;
    var words = [];

    for ( i = 0; i < key.length; i++ ) {
        codepoint = key.charCodeAt( i );
        hi = codepoint >> 8;
        lo = codepoint & 0xff;
        if ( hi ) {
            words[ f >> 2 ] |= hi << ( f++ % 4 * 8 );
        }
        words[ f >> 2 ] |= lo << ( f++ % 4 * 8 );
    }

    for ( i = 0; i < f; i += 4 ) {
        k1 = words[i >> 2];

        k1 = ((k1 & 0xffff) * 0xcc9e2d51) + ((((k1 >>> 16) * 0xcc9e2d51) & 0xffff) << 16);
        k1 = ( k1 << 15 ) | ( k1 >>> 17 );
        k1 = ((k1 & 0xffff) * 0x1b873593) + ((((k1 >>> 16) * 0x1b873593) & 0xffff) << 16);

        h1 ^= k1;
        if ( f - i > 3 ) {
            h1 = ( h1 << 13 ) | ( h1 >>> 19 );
            h1 = ((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16) + 0xe6546b64;
        }

    }

    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = ((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16);
    h1 ^= h1 >>> 13;
    h1 = ((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16);
    h1 ^= h1 >>> 16;
    
    return h1 >>> 0;
}

if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = murmur3;
}
