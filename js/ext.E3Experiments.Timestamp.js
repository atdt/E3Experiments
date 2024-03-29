/**
 * E3 Timestamp Experiment Campaign Loader
 */

/*jslint white:true, vars:true */
/*globals mw, $, murmurhash2_32_gc */

(function ( global ) {
    "use strict";

    // Because the LastModified extension uses inline styles, it trumps
    // stylesheets, so we need to modify it in-place.
    var style = {
        'display'   : 'block',
        'font-size' : '0.5em',
        'position'  : 'relative',
        'right'     : '0',
        'bottom'    : '0'
    };

    var event_id = 'timestamp-history-view';
    
    // Simple sandom sampling using murmurhash2
    function inSample( str, fraction ) {
        // murmurhash2_32_gc generates hashes in the 32-bit unsigned 
        // integer range ( 0 - 2^32 ).
        var sample = fraction * 4294967296,  // 2^32
            hash = murmurhash2_32_gc( str );
        // return ( hash <= sample );
        return true;
    }

    // Determine whether the current view should display the experiment
    function isEligible() {
        return (

            // The current user has not opted out
            !( mw.user.options.get('vector-noexperiments') )

            // We're on an article page
            && mw.config.get( 'wgIsArticle' )

            // The article is in the main namespace
            && mw.config.get( 'wgNamespaceNumber' ) === 0

            // The article is being viewed (not edited, printed, watched, etc.)
            && mw.config.get( 'wgAction' ).match( /view|purge/ )

            // This isn't a redirect
            && mw.util.getParamValue( 'redirect' ) !== 'no'

            // We're not in print view            
            && mw.util.getParamValue( 'printable' ) !== 'yes'

            // We're not viewing a diff
            && mw.util.getParamValue( 'diff' ) === null
            && mw.util.getParamValue( 'oldid' ) === null

            // The article is in the experiment sample
            && inSample( mw.config.get('wgIsArticle') )
        );
    }

    // The tracking URL is generated by the click-tracking extension. It will
    // log the event and redirect the user to the article's history page.
    function getTrackingURL() {
        var uri = $( '#ca-history a' ).attr( 'href' );
        return $.trackActionURL( encodeURI( uri ), event_id );
    }

    function trackTimestamp() {
        $( function () {
            var el = $( '.lastmodified' ), a = $( 'a', el );

            // Inject a click-tracking redirect URL
            a.attr( 'href', getTrackingURL() );

            // If the article has just been modified, LastModified occasionally
            // produces negative timestamps.
            if ( a.text().indexOf('-') !== -1 ) {
                a.text( 'Just updated' );
            }

            el.css( style ).appendTo( '#firstHeading' );
        } );
    }

    // Register the experiment as a campaign with the clicktracking extension
    mw.activeCampaigns = mw.activeCampaigns || {};
    mw.activeCampaigns.TimestampPosition = {
        name    : 'TimestampPosition',
        version : 1,
        rates   : {
            // Bucket 50% of users into group
            experimental : 1,
            none         : 1
        },
        experimental : function () {
            if ( isEligible() ) {
                mw.loader.using( 'last.modified', trackTimestamp );
            }
        }
    };

}( this ));
