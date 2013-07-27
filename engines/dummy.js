
var Dummy = function() {

    return {
        get_allowed_players : function() { return {min:2, max:4} },
        init : function(data) { },
        command : function(player, data) { 
            return {
                is_valid: true,
                timestamp : 999,
                data : 'gamestatus'
            }; 
        },
        get_status : function() { return {foo: 'dummy_gamestatus'} }
    }
};

module.exports = Dummy;