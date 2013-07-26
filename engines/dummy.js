
var Dummy = function() {

    return {
        command : function(player, data) { 
            return {
                is_valid: true
            }; 
        },
        get_allowed_players : function() { return {min:2, max:4} },
        get_status : function() { return {foo: 'dummy_gamestatus'} }
    }
};

module.exports = Dummy;