//
// Constants
//

// Date at which the experiment becomes active
activation_start = (a specific date)

// Duration of experiment being active for anyone at all
activation_period = (quantum of time)

// Duration of experiment being active for any one user
eligibility_period = (quantum of time)



//
// Helper Functions
//

// Determine whether user is in the experiment *at all* (in *any* bucket).
function isUserInExperiment() {
    return current_date <= ( signup_date + eligibility_period );
}

// Assign or resolve a user that is in the experiment to a particular bucket
function getUserBucket() {
    // Deterministically map user to some value in the range 1..9
    user_hash = getDeterministicHash( username );

    if ( user_hash <= 3 ) {
        return 'control';
    } else if ( user_hash <= 6 ) {
        return 'experimental_1';
    } else {
        return 'experimental_2';
    }
}

function shouldActivate() {
    var activation_stop = activation_start + activation_period;

    if ( activation_start <= current_date <= activation_stop ) {
        // the experiment is running for some users. now we need to decide if
        // it is running for this particular user.
        return isUserInExperiment();
    }
}



// 
// Main
//

if ( shouldActivate() ) {

    var user_bucket = getUserBucket();

    if ( user_bucket === 'control' ) {
        // track events but do not modify UI/UX
    } else if ( user_bucket == 'experimental_1' ) {
        // track events and show A condition
    } else {
        // track events and show B condition
    }

}


