/*jslint node: true, white: true, sloppy: true, forin: true */
/*global assert, mem, refute, alloc, resolve, assign, defineValues, Descriptor, Specifier, gets, puts, getd, getspc, symbols, reset, str, setUint, getUint, setInt, getInt, setReal, getReal, run, exec, ip, jmp, getterSetter */

var buster = require( 'buster' );

buster.extend( global, require( '../lib/snoflake/format' ) );

buster.testCase( 'Property Constructors', {
    getterSetter: function () {
        var goat = Object.create( {}, {
            age: getterSetter( 'AGE' )
        } );
        goat.age = 12;
        assert.equals( resolve('AGE'), 12 );
        assign( 'AGE', 13 );  // Happy birthday, Goat.
        assert.equals( goat.age, 13 );
    }
} );
        
buster.testCase( 'String Formatting', {
    format: function () {
        assert( String.prototype.format );
    },
    plain: function () {
        assert.equals( '{0} <3 {1}'.format('I', 'cheese'), 'I <3 cheese' );
        assert.equals( 'I ate {0} bananas'.format(3.14159), 'I ate 3.14159 bananas' );
    },
    width: function () {
        assert.equals( 'I ate {0.2} bananas'.format(Math.PI), 'I ate 3.14 bananas' );
    },
    malformed: function () {
        assert.equals( 'Hrm {0.1}'.format('hello'), 'Hrm NaN' );
    },
    undef: function () {
        assert.equals( '{0} is so {1}'.format('Custard'), 'Custard is so {1}' );
        assert.equals( 'This is so {0}'.format(), 'This is so {0}' );
    }
} );
